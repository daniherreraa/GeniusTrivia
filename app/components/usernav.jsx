"use client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserNav = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  console.log(user);

  return (
    <nav className="flex w-full items-center justify-between h-14 px-4 pt-4">
      <h3 className="font-bold text-white">GENIUS</h3>
      <Avatar className="outline-dashed outline-offset-2 outline-dodger-blue-300">
        <AvatarImage src={user.imageUrl}/>
        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
      </Avatar>
    </nav>
  );
};

export default UserNav;
