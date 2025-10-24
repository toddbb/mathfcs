import { Config_AvatarList } from "../config/config.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Ui from "./ui.mjs";
import User from "./user.mjs";

const modalUser = {
   allUsers: [],

   Dom: {},

   state: {
      currentUserId: null,
      user: {},
      newUserId: null,
      newUser: {},
   },

   /*********** EVENTS *******************/
   Events: {
      // User List: Users
      addEventsToUserListItems() {
         // avatar image
         const userAvatars = Dom.userListContainer.querySelectorAll(".user-select:not(.user-option-add)");
         userAvatars.forEach((avatar) => {
            avatar.addEventListener("click", (event) => {
               console.log(event.target);
               // check if the target was edit button, btn.user-select-edit; if so, call "handleBtnEditClick" instead
               if (event.target?.classList.contains("user-select-edit-button")) {
                  modalUser.Handlers.handleBtnEditClick(event.target);
                  return;
               } else {
                  modalUser.Handlers.handleUserListAvatarClick(event);
               }
            });
         });
      },

      // Edit Form: Avatar Selection
      addEventsToEditFormAvatars() {
         const avatarOptions = Dom.userEditAvatarContainer.querySelectorAll(".user-edit-avatar-option");
         avatarOptions.forEach((option) => {
            option.addEventListener("click", (event) => {
               modalUser.Handlers.handleEditFormAvatarClick(event);
            });
         });
      },
   },

   /*********** USER MANAGEMENT *******************/
   UserMgmt: {
      /**** User Management *****/
      getAllUsers() {
         // update Storage in case of any debounce
         User.Storage.updateUser(false);
         const currentUser = User.state.user;
         const allUsers = User.Storage.getAllUsers();
         // Sort users to have current user on top
         const allUsersSorted = allUsers.sort((a, b) => {
            if (a.name === currentUser.name) return -1;
            if (b.name === currentUser.name) return 1;
            return 0;
         });
         return allUsersSorted;
      },
   },

   /***********  HANDLERS  *******************/
   Handlers: {
      handleUserListAvatarClick(event) {
         const userId = event.target.closest(".user-select").dataset.userid;
         modalUser.state.currentUserId = userId;
         modalUser.state.user = modalUser.allUsers[userId];
         User.updateUserStateAndStorage(userId, modalUser.state.user);
         console.log("User changed to ID:", userId);
         User.init(); // re-initialize UI to reflect user change
         Ui.updateUserContainer(modalUser.state.user);
         Ui.updateScoreDisplay(modalUser.state.user.score);
         Ui.closeModal("user");
      },

      handleBtnEditClick(target) {
         const userId = target.closest(".user-select").dataset.userid;
         modalUser.state.currentUserId = userId;
         modalUser.Ui.showEditForm(userId);
      },

      handleUserAddClick() {
         console.log("Add User clicked");
         modalUser.state.newUser = User.userTemplate;
         modalUser.state.newUserId = modalUser.allUsers.length;
         modalUser.Ui.showEditForm(modalUser.state.newUserId, modalUser.state.newUser, modalUser.state.newUserId);
      },

      handleEditFormAvatarClick(event) {
         const selectedAvatarId = event.target.dataset.avatarid;
         console.log("Selected Avatar ID:", selectedAvatarId);
         // Deselect all other avatars
         const avatarOptions = Dom.userEditAvatarContainer.querySelectorAll(".user-edit-avatar-option");
         Utils.removeClass(avatarOptions, "selected");
         // Select clicked avatar
         Utils.addClass(event.target, "selected");
      },

      async handleUserEditSave() {
         const isNewUser = modalUser.state.newUserId !== null;
         console.log("User Edit: Save clicked");
         const { userId, newName, newAvatarId } = modalUser.EditForm.getFormData();
         console.log("Form Data:", { userId, newName, newAvatarId });

         // Validate form data
         if (!newName || newName === "" || newAvatarId === null) {
            console.warn("Invalid form data - name or avatar not selected");
            return;
         }

         if (isNewUser) {
            console.log("Creating new user in modalUser state");
            modalUser.state.user = modalUser.state.newUser;
            await User.Storage.addUser(modalUser.state.user);
         }

         // update modalUser
         modalUser.state.user.avatarId = newAvatarId;
         modalUser.state.user.name = newName;
         modalUser.state.currentUserId = userId;

         console.log("Updated user data:", modalUser.state.user);

         // update User state & storage
         User.updateUserStateAndStorage(userId, modalUser.state.user);

         // Hide the edit form
         Utils.hide(Dom.userEditContainer);
         modalUser.Ui.disableBackground(false);

         // Re-render the user list to reflect changes
         modalUser.reset();
         modalUser.init();

         console.log("User data updated successfully");

         Ui.updateUserContainer();
         Ui.updateScoreDisplay();

         User.init(); // re-initialize UI to reflect user change
         Ui.closeModal("user");
      },

      handleUserEditCancel() {
         console.log("User Edit: Cancel clicked");
         // hide edit form
         Utils.hide(Dom.userEditContainer);
         // enable background interaction
         modalUser.Ui.disableBackground(false);
      },
   },

   /****** User List *******/
   UserList: {
      // build the elements
      _buildUserList(userId, userName, avatarId) {
         // container div
         const containerDivOptions = {
            parent: Dom.userListContainer,
            classes: "user-select flex flex-col items-center gap-1 cursor-pointer",
            attributes: {
               "data-userid": userId,
            },
            prepend: true,
         };
         const containerDiv = Utils.createElement("div", containerDivOptions);

         // avatar image
         const avatarImgOptions = {
            parent: containerDiv,
            classes: "user-select-avatar",
            attributes: {
               src: `./assets/avatars/avatar-${avatarId}.JPG`,
               "data-avatarid": avatarId,
               alt: `Avatar ${avatarId}`,
            },
         };
         Utils.createElement("img", avatarImgOptions);

         // user name span
         const userNameSpanOptions = {
            parent: containerDiv,
            classes: "user-select-name",
            textContent: userName,
         };
         Utils.createElement("span", userNameSpanOptions);

         // edit button
         const editBtnOptions = {
            parent: containerDiv,
            classes: "btn user-select-edit-button",
            textContent: "Edit",
         };
         Utils.createElement("button", editBtnOptions);
      },

      // add elements after the elements are added to the DOM

      /// Main function to populate user list
      populateUserList() {
         let userId, userName, avatarId;

         modalUser.allUsers.forEach((user, index) => {
            userId = index;
            userName = user.name;
            avatarId = user.avatarId;

            modalUser.UserList._buildUserList(userId, userName, avatarId);
         });

         modalUser.Events.addEventsToUserListItems();
      },
   },

   /****** Edit Form *******/
   EditForm: {
      _buildEditForm_avatars(userId, newUser, newUserId) {
         const parent = Dom.userEditAvatarContainer;
         parent.innerHTML = ""; // clear existing avatars
         const currentAvatarId = modalUser.allUsers[userId]?.avatarId || 0;
         const avatarList = Config_AvatarList;

         avatarList.forEach((avatarFileName, index) => {
            const avatarId = index;
            const avatarImgOptions = {
               parent: Dom.userEditAvatarContainer,
               classes: "user-edit-avatar-option cursor-pointer",
               attributes: {
                  src: `./assets/avatars/${avatarFileName}`,
                  "data-avatarid": avatarId,
                  alt: `Avatar ${avatarId}`,
               },
            };
            if (index === currentAvatarId) {
               avatarImgOptions.classes += " selected";
            } else if (newUserId && index === 0) {
               avatarImgOptions.classes += " new-user";
            }
            Utils.createElement("img", avatarImgOptions);
         });

         // add event listeners
         modalUser.Events.addEventsToEditFormAvatars();
      },

      _populateEditForm(userId, newUser, newUserId) {
         console.log("Populate edit form for userId:", userId);
         // add all of the optional avatars to the avatar list container
         modalUser.EditForm._buildEditForm_avatars(userId, newUser, newUserId);
         // populate the name input
         Dom.userEditNameInput.value = modalUser.allUsers[userId]?.name || newUser.name;
      },

      getFormData() {
         // get current user ID being edited
         const userId = modalUser.state.currentUserId;
         // get new name
         const newName = Dom.userEditNameInput.value.trim();
         // get selected avatar ID
         const selectedAvatarEl = Dom.userEditAvatarContainer.querySelector(".user-edit-avatar-option.selected");
         const newAvatarId = selectedAvatarEl ? parseInt(selectedAvatarEl.dataset.avatarid) : null;
         return { userId, newName, newAvatarId };
      },
   },

   /********* UI ***************/
   Ui: {
      disableBackground(isDisable = false) {
         if (isDisable) {
            Utils.addClass(Dom.modalUser, "darken");
            Utils.addClass(Dom.modalUserWrapper, "disable-interaction");
         } else {
            Utils.removeClass(Dom.modalUser, "darken");
            Utils.removeClass(Dom.modalUserWrapper, "disable-interaction");
         }
      },

      showEditForm(userId, newUser, newUserId) {
         console.log("Show edit form for userId:", userId);
         // Populate the edit form with user data
         modalUser.EditForm._populateEditForm(userId, newUser, newUserId);

         // disable background interaction
         modalUser.Ui.disableBackground(true);

         // lastly, show the edit form
         Utils.show(Dom.userEditContainer);
      },

      hideEditForm() {},
   },

   /********** Reset and Init *********/
   reset() {
      modalUser.allUsers = [];
      modalUser.state.currentUserId = null;
      modalUser.state.user = {};

      // remove .user-select elements except for .user-select.user-add
      const userOptions = Dom.userListContainer.querySelectorAll(".user-select:not(.user-add)");
      userOptions.forEach((option) => {
         option.remove();
      });

      // remove event listeners
      const userEditButtons = Dom.userListContainer.querySelectorAll(".user-select-edit-button");
      userEditButtons.forEach((btn) => {
         btn.removeEventListener("click", modalUser.showEditForm);
      });
   },

   init() {
      modalUser.reset();
      // get all users
      modalUser.allUsers = modalUser.UserMgmt.getAllUsers();
      console.log("All users:", modalUser.allUsers);

      // get the current user ID and user data
      modalUser.state.currentUserId = User.state.currentUserId;

      // populate user list
      modalUser.UserList.populateUserList();
   },
};

export default modalUser;
