import Link from "next/link";

interface NavListProps {
  variant: "desktop" | "mobile";

  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ({ variant, setIsMenuOpen }: NavListProps) {
  const links = [
    { name: "Cars", link: "/cars" },
    { name: "Parts", link: "/parts" },
    { name: "Accessories", link: "/accessories" },
    { name: "Services & Repairs", link: "/services-repairs" },
  ];
  return (
    <>
      {variant === "desktop" ? (
        <nav className="hidden md:flex space-x-6 items-center">
          {links.map((li) => (
            <Link
              key={li.link}
              className="hover:bg-gray-600 py-1 px-3 hover:rounded hover:text-white transition-all duration-700"
              href={li.link}
            >
              {li.name}
            </Link>
          ))}
        </nav>
      ) : (
        <nav className="bg-gray-100 rounded-b-2xl">
          <ul className="flex flex-col p-4 space-y-2">
            {links.map((li) => (
              <li key={li.link}>
                <Link
                  onClick={() => setIsMenuOpen?.(false)}
                  className="hover:bg-gray-600 w-full py-1 px-3 hover:rounded hover:text-white transition-all duration-700 block"
                  href={li.link}
                >
                  {li.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
