package repository

import "github.com/jmoiron/sqlx"

type Authorization interface {
}

type Repository struct {
	Authorization
}

func NewAuthorization(db *sqlx.DB) *Repository {
	return &Repository{}
}
