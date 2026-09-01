"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";

type QueryPreviewDialogProps<T> = {
  children: React.ReactNode;

  /**
   * Fetch the items displayed by the dialog.
   */
  query: () => Promise<T[]>;

  /**
   * Render each item.
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * Unique key for each item.
   */
  getKey?: (item: T, index: number) => string | number;

  title?: React.ReactNode;
  description?: React.ReactNode;

  loading?: React.ReactNode;
  empty?: React.ReactNode;
  error?: React.ReactNode;

  /**
   * Limit the number of items displayed.
   */
  maxItems?: number;

  /**
   * Optional callback when dialog opens.
   */
  onOpen?: () => void;

  /**
   * Optional callback when dialog closes.
   */
  onClose?: () => void;

  /**
   * Refetch every time the dialog opens.
   */
  refetchOnOpen?: boolean;

  className?: string;
  contentClassName?: string;
};

export function QueryPreviewDialog<T>({
  children,
  query,
  renderItem,
  getKey,
  title,
  description,
  loading,
  empty,
  error,
  maxItems,
  onOpen,
  onClose,
  refetchOnOpen = true,
  className = "",
  contentClassName = "",
}: QueryPreviewDialogProps<T>) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const requestId = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  const fetchItems = useCallback(async () => {
    const id = ++requestId.current;

    setIsLoading(true);
    setHasError(false);

    try {
      const result = await query();

      if (id !== requestId.current) {
        return;
      }

      setItems(result);
    } catch (error) {
      console.error(
        "[QUERY_PREVIEW_DIALOG_ERROR]",
        error
      );

      if (id !== requestId.current) {
        return;
      }

      setItems([]);
      setHasError(true);
    } finally {
      if (id === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [query]);

  const openDialog = useCallback(() => {
    setOpen(true);
    onOpen?.();

    if (refetchOnOpen || items.length === 0) {
      void fetchItems();
    }
  }, [
    fetchItems,
    items.length,
    onOpen,
    refetchOnOpen,
  ]);

  const closeDialog = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  /**
   * Escape key.
   */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, closeDialog]);

  /**
   * Lock body scroll.
   */
  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /**
   * Focus dialog.
   */
  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
  }, [open]);

  const displayedItems =
    typeof maxItems === "number"
      ? items.slice(0, maxItems)
      : items;

  return (
    <>
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        className={`cursor-pointer ${className}`}
        onClick={openDialog}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openDialog();
          }
        }}
      >
        {children}
      </div>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={closeDialog}
            className="
              absolute
              inset-0
              bg-slate-950/50
              backdrop-blur-sm
            "
          />

          {/* Container */}
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={
              title ? titleId : undefined
            }
            aria-describedby={
              description
                ? descriptionId
                : undefined
            }
            className="
              absolute
              inset-x-0
              bottom-0
              sm:inset-4
              sm:m-auto
              w-full
              sm:max-w-5xl
              h-[90vh]
              sm:h-auto
              sm:max-h-[90vh]
              bg-white
              rounded-t-[2rem]
              sm:rounded-[2rem]
              shadow-2xl
              overflow-hidden
              outline-none
              flex
              flex-col
              animate-in
              fade-in
              slide-in-from-bottom-5
              sm:zoom-in-95
              duration-200
            "
          >
            {/* Header */}
            <header
              className="
                shrink-0
                flex
                items-start
                justify-between
                gap-4
                px-6
                py-5
                border-b
                border-slate-100
              "
            >
              <div className="min-w-0">
                {title && (
                  <h2
                    id={titleId}
                    className="
                      text-lg
                      sm:text-xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {title}
                  </h2>
                )}

                {description && (
                  <p
                    id={descriptionId}
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close"
                className="
                  shrink-0
                  w-9
                  h-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-slate-100
                  text-slate-500
                  hover:bg-slate-200
                  hover:text-slate-900
                  transition
                "
              >
                <X size={18} />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                loading ?? (
                  <div
                    className="
                      min-h-[400px]
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >
                    <Loader2
                      className="
                        animate-spin
                        text-blue-600
                      "
                      size={30}
                    />

                    <p
                      className="
                        mt-4
                        text-sm
                        font-medium
                        text-slate-500
                      "
                    >
                      Loading vehicles...
                    </p>
                  </div>
                )
              ) : hasError ? (
                error ?? (
                  <div
                    className="
                      min-h-[400px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      px-6
                    "
                  >
                    <div
                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-red-50
                        text-red-500
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <AlertCircle size={22} />
                    </div>

                    <h3
                      className="
                        mt-4
                        font-semibold
                        text-slate-900
                      "
                    >
                      Couldn&apos;t load listings
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      Something went wrong while
                      retrieving the vehicles.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        void fetchItems()
                      }
                      className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-slate-900
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-slate-800
                      "
                    >
                      <RefreshCw size={15} />
                      Try again
                    </button>
                  </div>
                )
              ) : displayedItems.length === 0 ? (
                empty ?? (
                  <div
                    className="
                      min-h-[400px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      px-6
                    "
                  >
                    <div className="text-4xl">
                      🚗
                    </div>

                    <h3
                      className="
                        mt-4
                        font-semibold
                        text-slate-900
                      "
                    >
                      No vehicles found
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      There are currently no
                      vehicles in this classification.
                    </p>
                  </div>
                )
              ) : (
                <div
                  className={`
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                    p-6
                    ${contentClassName}
                  `}
                >
                  {displayedItems.map(
                    (item, index) => (
                      <div
                        key={
                          getKey
                            ? getKey(item, index)
                            : index
                        }
                      >
                        {renderItem(item, index)}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}