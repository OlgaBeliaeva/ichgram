import s from "../notificationBar.module.css"
import { FC, useEffect, useState } from "react";
import { getUserByIdApi } from "../../../api/services/usersService";
import { $api } from "../../../api/api";
import parseData from "../../../helpers/parseData";
import { Notification } from "../../../interfaces/notification.interface";
import { IUser } from "../../../interfaces/user.interface";
import noPhoto from "../../../assets/noPhoto.png";

const NotificationItem: FC<Notification> = ({
  _id,
  content,
  sender_id,
  created_at,
  is_read,
  type
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [read, setRead] = useState<boolean>(is_read);

  useEffect(() => {
    const handleGetUser = async () => {
      const data = await getUserByIdApi(sender_id);
      setUser(data);
    };
    handleGetUser();
  }, [sender_id]);

  const handleReadNotification = async () => {
    try {
      await $api.patch(`/notifications/${_id}`, {
        is_read: true,
      });
      setRead(true);
    } catch (error) {
      console.error("Ошибка при чтении уведомления:", error);
    }
  };

  if (!user) {
    return <p>Loading</p>;
  }
  return (
    <li key={_id} className={s.notificationItem} style={{ background: !read ? "#f3f3f3" : "#FFF" }}>
      <div className={s.userAvatar_box}>
      <img src={user.profile_image || noPhoto} alt={user.username} className={s.avatar}/>
        <div>
          <p><span className={s.userName}>{user.username}</span> {content}</p>
          <p className={s.parsedData}>{parseData(created_at)}</p>
        </div>
      </div>
      <div>
        {!read && <button className={s.notBtn} onClick={handleReadNotification}>Read</button>}
      </div>
    </li>
  );
};

export default NotificationItem;
