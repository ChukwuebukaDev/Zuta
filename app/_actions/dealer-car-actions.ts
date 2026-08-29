"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ListingStatus, CarStatus, Role } from "@prisma/client";

async function getAuthenticatedDealer() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: "You must be logged in.",
      user: null,
    };
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      role: true,
    },
  });

  if (!dbUser) {
    return {
      error: "User account not found.",
      user: null,
    };
  }

  if (dbUser.role !== Role.DEALER) {
    return {
      error: "Only dealers can manage dealer inventory.",
      user: null,
    };
  }

  return {
    error: null,
    user: dbUser,
  };
}

/**
 * Mark a dealer's vehicle as sold.
 */
export async function markCarAsSold(carId: string) {
  const auth = await getAuthenticatedDealer();

  if (auth.error || !auth.user) {
    return { success: false, error: auth.error };
  }

  if (!carId) {
    return { success: false, error: "Car ID is required." };
  }

  const car = await db.car.findFirst({
    where: {
      id: carId,
      userId: auth.user.id,
    },
    select: {
      id: true,
      status: true,
      listingStatus: true,
    },
  });

  if (!car) {
    return {
      success: false,
      error: "Car not found or you do not have permission to manage it.",
    };
  }

  if (car.status === CarStatus.SOLD || car.listingStatus === ListingStatus.SOLD) {
    return {
      success: false,
      error: "This car is already marked as sold.",
    };
  }

  await db.car.update({
    where: {
      id: car.id,
    },
    data: {
      status: CarStatus.SOLD,
      listingStatus: ListingStatus.SOLD,
      soldAt: new Date(),
    },
  });

  revalidatePath("/dashboard/inventory");
  revalidatePath(`/cars/${carId}`);

  return {
    success: true,
    message: "Car marked as sold.",
  };
}

/**
 * Hide a dealer's vehicle from active inventory.
 */
export async function archiveCar(carId: string) {
  const auth = await getAuthenticatedDealer();

  if (auth.error || !auth.user) {
    return { success: false, error: auth.error };
  }

  if (!carId) {
    return { success: false, error: "Car ID is required." };
  }

  const car = await db.car.findFirst({
    where: {
      id: carId,
      userId: auth.user.id,
    },
    select: {
      id: true,
      listingStatus: true,
    },
  });

  if (!car) {
    return {
      success: false,
      error: "Car not found or you do not have permission to manage it.",
    };
  }

  if (car.listingStatus === ListingStatus.ARCHIVED) {
    return {
      success: false,
      error: "This car is already archived.",
    };
  }

  await db.car.update({
    where: {
      id: car.id,
    },
    data: {
      listingStatus: ListingStatus.ARCHIVED,
      archivedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/inventory");
  revalidatePath(`/cars/${carId}`);

  return {
    success: true,
    message: "Car has been unlisted.",
  };
}

/**
 * Permanently delete a dealer's vehicle.
 */
export async function deleteDealerCar(carId: string) {
  const auth = await getAuthenticatedDealer();

  if (auth.error || !auth.user) {
    return { success: false, error: auth.error };
  }

  if (!carId) {
    return { success: false, error: "Car ID is required." };
  }

  const car = await db.car.findFirst({
    where: {
      id: carId,
      userId: auth.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!car) {
    return {
      success: false,
      error: "Car not found or you do not have permission to manage it.",
    };
  }

  await db.car.delete({
    where: {
      id: car.id,
    },
  });

  revalidatePath("/dashboard/inventory");

  return {
    success: true,
    message: "Car deleted successfully.",
  };
}