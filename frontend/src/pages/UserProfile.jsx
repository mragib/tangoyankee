import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChangePasswordForm from "@/features/authentication/ChangePasswordForm";
import EditUserProfileForm from "@/features/authentication/EditUserProfileForm";
import { useUser } from "@/features/authentication/useUser";
import Button from "@/ui/Button";

import Modal from "@/ui/Modal";
import Spinner from "@/ui/Spinner";
import { useState } from "react";

function UserProfile() {
  const { user, isGetingUser } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State to store the selected file
  const [imagePreview, setImagePreview] = useState(null);

  if (isGetingUser) return <Spinner />;

  {
    imagePreview && <img src={imagePreview} alt="Image preview" width="100" />;
  }

  return (
    <div className="transaction transition-all grid  md:grid-cols-[1fr_2fr] gap-4">
      <div className=" flex flex-col w-full gap-4 py-8 px-4 items-center justify-center border rounded-md bg-slate-200 hover:bg-slate-300 hover:shadow-lg">
        <Avatar className="h-30 w-30">
          <AvatarImage
            src={
              imagePreview
                ? imagePreview
                : user.image
                ? `${import.meta.env.VITE_BACKEND_URL}${user.image}`
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            }
          />
          <AvatarFallback>{user.first_name}</AvatarFallback>
        </Avatar>
        <div className="flex gap-2">
          <p>{user.first_name}</p>
          <p>{user.last_name}</p>
        </div>

        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.address}</p>
        {user.page_name && <p>{user.page_name}</p>}
        {user.business_address && <p>{user.business_address}</p>}
        <div className="grid grid-cols-2 gap-4">
          <Button variation="primary" onClick={() => setShowForm(!showForm)}>
            Edit Info
          </Button>
          <Modal>
            <Modal.Open opens="password">
              <Button variation="danger">Change Password</Button>
            </Modal.Open>
            <Modal.Window name="password">
              <ChangePasswordForm />
            </Modal.Window>
          </Modal>
        </div>
      </div>
      <div>
        {showForm && (
          <EditUserProfileForm
            user={user}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setProfileImage={setProfileImage}
            profileImage={profileImage}
            setShowForm={setShowForm}
          />
        )}
      </div>
    </div>
  );
}

export default UserProfile;
