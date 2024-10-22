import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { AppState, useAppDispatch, useAppSelector } from "@/store/store";
import { setIsOpen } from "@/store/reducers/sidebarReducer";
import { AiOutlineMenu } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import toast from "react-hot-toast";
import { logoutUser } from "@/store/actions/authActions";
import { getNotification, markAllAsRead } from "@/store/actions/notificationActions";
import { formatDate } from "@/utils/usableFunc";
import { Loading } from "@/components/common/Loading";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: AppState) => state.auth);
  const { notifications, isLoading } = useAppSelector((state: AppState) => state.notification);

  useEffect(() => {
    if (notifications?.length === 0) {
      dispatch(getNotification());
    }
  }, [dispatch]); // Added notifications as a dependency

  const handleSidebarOpen = () => {
    dispatch(setIsOpen(true));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } catch (error: any) {
      toast.error("Failed to log out: " + error.message);
    }
  };

  const handleReadNotification = async () => {
    try {
      await dispatch(markAllAsRead());
    } catch (error: any) {
      toast.error("Failed to mark notifications as read: " + error.message);
    }
  };
  const formattedNotifications = notifications.map(notification => ({
    ...notification,
    createdAt: new Date(notification.createdAt),
  }));
  
  formattedNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="flex flex-row justify-between items-center px-5 py-3">
        {/* Logo */}
        <div className="flex xl:opacity-0 items-center gap-[5px] px-[20px]">
          <img src="/logo.svg" alt="Logo" className="w-[40px]" />
        </div>

        <div className="flex flex-row items-center gap-5">
          {/* Notifications Popover */}
          <Popover onOpenChange={(open) => { if (open) handleReadNotification(); }}>
            <PopoverTrigger asChild>
              <div className="w-[38px] h-[38px] flex items-center justify-center rounded-full relative hover:bg-gray-100 cursor-pointer">
                <Icon icon="ion:notifications" className="w-5 h-5 text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="md:w-[360px] w-[100vw] bg-white shadow-lg">
              <h3 className="text-sm font-semibold p-2 border-b">Notifications</h3>
              <div className="p-2">
                {isLoading ? (
                  <Loading size={25} /> // Added loading spinner instead of "Loading"
                ) : notifications.length > 0 ? (
                  formattedNotifications
                    .map((notification, index) => (
                      <div key={index} className="text-sm flex justify-between py-[10px] items-center last:border-none">
                        <p>{notification.message}</p>
                        <p className="min-w-fit">{formatDate(notification.createdAt)}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">No notifications available</p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User profile Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="!flex !items-center !gap-5 !px-2 !py-1 !shadow-sm !rounded-sm">
                <div className="w-[34px] h-[34px] rounded-full bg-white border border-gray-100 flex items-center justify-center">
                  <CiUser fontSize={24} />
                </div>
                <h2 className="text-sm font-medium text-black">
                  {user?.username || "Guest"} {/* Ensured fallback if username is not available */}
                </h2>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-white mr-2">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Button
                    onClick={handleLogout}
                    className="border w-full border-gray-100 py-2 flex items-center gap-2"
                    variant={"outline"}
                  >
                    <IoLogOutOutline fontSize={24} className="text-black" />
                    <h2 className="text-base font-medium">Logout</h2>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSidebarOpen}
            className="!rounded-full block xl:hidden"
            variant={"outline"}
          >
            <AiOutlineMenu fontSize={24} className="text-gray-700" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
