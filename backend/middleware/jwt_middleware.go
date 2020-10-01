package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// JwtMiddleware ...
func JwtMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		bearerToken := strings.Split(authHeader, " ")

		if len(bearerToken) == 2 {
			token, _ := jwt.Parse(bearerToken[1], func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
				return []byte(os.Getenv("JWT_SECRET")), nil
			})

			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				//fmt.Println(claims)
				c.Set("jwt_user_id", claims["user_id"])
			} else {
				c.JSON(http.StatusOK, gin.H{"status": 401, "message": "Invalid Token"})
				c.Abort()
				return
			}

		} else {
			c.JSON(http.StatusOK, gin.H{"status": 401, "message": "Unauthorized"})
			c.Abort()
			return
		}
	}
}
