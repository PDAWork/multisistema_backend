package main

import (
	"github.com/spf13/viper"
	"github.com/subosito/gotenv"
	"log"
	"multisistema_backend"
	"multisistema_backend/pkg/handler"
	"multisistema_backend/pkg/repository"
	"multisistema_backend/pkg/service"
	"os"
)

func main() {

	if err := initConfig(); err != nil {
		log.Fatal("Error initial config $s ", err.Error())
	}

	if err := gotenv.Load(".env"); err != nil {
		log.Fatal("Error initial env file $s", err.Error())
	}

	db, err := repository.NewPostgresDB(repository.Config{
		Host:     viper.GetString("db.host"),
		Port:     viper.GetString("db.port"),
		UserName: viper.GetString("db.userName"),
		Password: os.Getenv("DB_PASSWORD"),
		DBName:   viper.GetString("db.dbName"),
		SSLMode:  viper.GetString("db.sslMode"),
	})

	if err != nil {
		log.Fatal("Error initial db $s ", err.Error())
	}

	repos := repository.NewAuthorization(db)
	service := services.NewAuthorization(repos)
	handlers := handler.NewHandler(service)

	srv := new(multisistema.Server)
	if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
		log.Fatal("Ошибка запуска сервера %s", err.Error())
	}
}

func initConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}
