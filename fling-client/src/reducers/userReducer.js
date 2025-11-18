const userReducer = (users, action) => {
    console.log(users, action)
    switch (action.type) {
        case "set":
            return [...action.users]
        case "add":
            return [...users, action.userName]
        case "delete": {
            return users.filter(u => u !== action.userName)
        }
        default:
            return users;
    }
}

export default userReducer