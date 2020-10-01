package models

import (
	"time"
)

// TableName ...
func (Transaction) TableName() string {
	return "transaction"
}

// Transaction ...
type Transaction struct {
	TransactionID uint      `gorm:"primary_key;column:transaction_id" json:"transaction_id"`
	SenderID      uint      `gorm:"column:sender_id"  json:"sender_id"`
	ReceivedID    uint      `gorm:"column:receiver_id"  json:"receiver_id"`
	Amount        uint      `gorm:"column:amount"  json:"amount"`
	CreatedAt     time.Time `gorm:"column:created_at;type:datetime"  json:"created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at;type:datetime"  json:"updated_at"`
	Sender        *User     `gorm:"foreignkey:SenderID" json:"sender,omitempty"`
	Receiver      *User     `gorm:"foreignkey:ReceiverID" json:"receiver,omitempty"`
}
