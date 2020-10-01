package models

import (
	"time"
)

// TableName ...
func (Transaction) TableName() string {
	return "transactions"
}

// Transaction ...
type Transaction struct {
	TransactionID uint      `gorm:"primary_key;column:user_id" json:"user_id"`
	SenderID      string    `gorm:"unique;column:sender_id"  json:"sender_id" binding:"required"`
	ReceivedID    string    `gorm:"unique;column:receiver_id"  json:"receiver_id" binding:"required,email"`
	Amount        uint      `gorm:"column:saldo"  json:"saldo" binding:"required"`
	CreatedAt     time.Time `gorm:"column:created_at;type:datetime"  json:"created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at;type:datetime"  json:"updated_at"`
}
