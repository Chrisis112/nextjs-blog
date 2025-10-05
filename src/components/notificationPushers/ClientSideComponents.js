'use client';
import {useProfile} from "@/components/UseProfile";
import PusherOrderNotifications from "@/components/notificationPushers/PusherOrderNotifications";
import FirebaseNotifications from "@/components/notificationPushers/FirebaseNotifications";

export default function ClientSideComponents() {
  const {loading, data: profile} = useProfile();

  return (
    <>
      <PusherOrderNotifications seller={profile?.seller} />
      <FirebaseNotifications userSeller={profile?.seller} />
    </>
  );
}
