package handler

import (
	"github.com/gin-gonic/gin"
	"multisistema_backend/pkg/service"
)

type Handler struct {
	service *services.Service
}

func NewHandler(services *services.Service) *Handler {
	return &Handler{service: services}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/sign-up", h.signUp)
			auth.POST("/sign-in", h.signIn)
		}
	}

	return router
}

//type UserMethods interface {
//	GetUser() string
//}
//
//type User struct {
//	userMethods UserMethods
//}
//
//func NewUser(userMethods UserMethods) *User {
//	return  &User{
//		userMethods: userMethods,
//	}
//}
//
//func (u *User) GetUser() string{
//
//}
//
