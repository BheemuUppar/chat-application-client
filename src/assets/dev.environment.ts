let baseUrl = "http://localhost:3000/";

export const environment = {
    baseUrl:baseUrl,
    register:`${baseUrl}auth/register`,
    login:`${baseUrl}auth/login`,
    saveProfilePic:`${baseUrl}users/upload/profile`,
    changeGroupProfilePic:`${baseUrl}users/upload/groupProfile`,
    createGroup:`${baseUrl}users/creategroup`,
    getUserData:`${baseUrl}users/getuser/`,
    searchUser:`${baseUrl}users/search?search=`,
    getAllInbox:`${baseUrl}users/getAllChats/`,
    getAllMessages:`${baseUrl}users/getAllMessage/`,
    getGroupInfo:`${baseUrl}users/group/info/`,
    getChatInfo:`${baseUrl}users/chat/info/`
    

    
}