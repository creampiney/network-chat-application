import { useOutletContext } from "react-router-dom";
import { UserObject } from "../../pages/chat/ChatPage";

const Home = () => {
  const { userCount, userMap } = useOutletContext<{
    userCount: number;
    userMap: UserObject[];
  }>();

  return (
    <div className="w-full py-5 px-6">
      <h2>Online Users {userCount}</h2>
      <ul>
        {userMap.map((user, idx) => {
          return <li key={idx}>{user.displayName}</li>;
        })}
      </ul>
    </div>
  );
};

export default Home;
