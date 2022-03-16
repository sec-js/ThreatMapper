package app

import (
	"fmt"

	"github.com/gomodule/redigo/redis"
	"github.com/ugorji/go/codec"
	"github.com/weaveworks/scope/report"
)

func ApplyRender() {
	redisPool, _ := newRedisPool()
	redisConn := redisPool.Get()
	ps := redis.PubSubConn {redisConn}
	channel := make(chan(redis.Message))
	ps.Subscribe(channel)

	go func() {
		for {
			select {
			case m := <- channel:
				var report report.Report
				decoder := codec.NewDecoderBytes(m.Data, &codec.JsonHandle{})
				if err := decoder.Decode(&report); err != nil {
					fmt.Println(err)
				}
			}
		}
	} ()
}
