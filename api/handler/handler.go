package handler

type IHandler[T any] interface {
	Get() T
	GetById(id int) T
}
