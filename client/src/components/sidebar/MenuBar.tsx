import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../lib/contexts/UserContext";
import { Avatar } from "@mui/material";

function MenuBar() {
  const iconClassName = "h-4 w-4";
  const navigate = useNavigate();
  const { currentUser, fetchUser } = useUser();
  const menuList = [
    {
      name: "Log Out",
      icon: <MdLogout className={iconClassName} />,
      onClick: async () => {
        try {
          const result = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/auth/logout",
            {
              method: "POST",
              credentials: "include",
            }
          );
          fetchUser();
          navigate("/");
        } catch (err) {
          console.log(err);
        }
      },
    },
  ];

  const isTooCloseToWhite = (color: string): boolean => {
    const r: number = parseInt(color.substring(1, 3), 16);
    const g: number = parseInt(color.substring(3, 5), 16);
    const b: number = parseInt(color.substring(5, 7), 16);

    const brightness: number = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 200;
  };

  const getRandomColor = (): string => {
    const letters: string = "0123456789ABCDEF";
    let color: string = "#";

    do {
      color = "#";
      for (let i: number = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (isTooCloseToWhite(color));

    return color;
  };

  const gradientText = document.getElementById("gradientText");

  if (gradientText) {
    gradientText.style.backgroundImage = `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})`;
  }

  return (
    <div>
      <ul className="menu bg-base-200 w-56 rounded-box text-sm">
        {currentUser && (
          <li className="flex justify-center items-center">
            <button
              className="w-fit h-fit rounded-full"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <Avatar sx={{ width: 52, height: 52 }} src={currentUser.avatar} />
            </button>
            <div
              id="gradientText"
              className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 pointer-events-none"
            >
              Hello, {currentUser.displayName}
            </div>
          </li>
        )}
        {menuList.map((data) => {
          if (currentUser) {
            return (
              <li key={data.name}>
                <button
                  className="w-full flex items-center hover:bg-slate-100"
                  onClick={data.onClick}
                >
                  {data.icon}
                  <span className="text-sm">{data.name}</span>
                </button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

export default MenuBar;
