package main

import (
	"github.com/webtoor/test-indodax-go/backend/routers"
)

func main() {

	r := routers.SetupRouter()

	/* go func() {
		go r.Run(":8080")
	}() */

	//log.Fatal(autotls.Run(r, "api.vuenic.com"))
	r.Run(":8080")
}
