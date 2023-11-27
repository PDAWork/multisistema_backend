package services

import "multisistema_backend/pkg/repository"

type Authorization interface {
}

type Service struct {
	Authorization
}

func NewAuthorization(repo *repository.Repository) *Service {
	return &Service{}
}
