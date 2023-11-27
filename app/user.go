package multisistema

type User struct {
	Id        int    `json:"-"`
	Login     string `json:"login" binding:"required"` // email -> login
	Password  string `json:"password" binding:"required"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Phone     string `json:"phone" binding:"required"`
}
