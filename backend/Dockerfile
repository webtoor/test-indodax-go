FROM golang:1.14-alpine 

WORKDIR /go/src/github.com/webtoor/test-indodax-go/backend
COPY . /go/src/github.com/webtoor/test-indodax-go/backend

RUN go build -o main .
CMD ["./main"]