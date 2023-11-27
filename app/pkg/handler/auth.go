package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	multisistema "multisistema_backend"
	"net/http"
)

func (h *Handler) signIn(ctx *gin.Context) {

}
func (h *Handler) signUp(ctx *gin.Context) {
	var input multisistema.User

	if err := ctx.BindJSON(&input); err != nil {
		newErrorResponse(ctx, http.StatusBadRequest, "invalid input body")
		return
	}

	values := map[string]interface{}{"email": &input.Login, "password": &input.Password}
	json_data, err := json.Marshal(values)

	if err != nil {
		log.Fatal(err)
	}

	resp, err := http.Post("https://api.saures.ru/doc/1.0/login", "application/json", bytes.NewBuffer(json_data))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Error making HTTP request: %s", err)})
		return
	}
	defer resp.Body.Close()

	var res map[string]interface{}

	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding JSON response"})
		return
	}

	// Check if the "form" key exists in the response
	formValue, ok := res["form"].(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Response does not contain the 'form' key"})
		return
	}

	// Return the decoded JSON response
	ctx.JSON(http.StatusOK, gin.H{"form": formValue})
}
