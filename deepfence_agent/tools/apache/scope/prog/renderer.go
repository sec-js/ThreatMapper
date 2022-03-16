package main

import (
	"fmt"
	"runtime"

	log "github.com/sirupsen/logrus"
	"github.com/weaveworks/common/tracing"
	"github.com/weaveworks/scope/app"
)

func rendererMain(flags appFlags) {

	setLogLevel(flags.logLevel)
	setLogFormatter(flags.logPrefix)
	runtime.SetBlockProfileRate(flags.blockProfileRate)

	registerAppMetricsOnce.Do(registerAppMetrics)

	traceCloser, err := tracing.NewFromEnv(fmt.Sprintf("scope-renderer-%s", flags.serviceName))
	if err != nil {
		log.Infof("Tracing not initialized: %s", err)
	} else {
		defer traceCloser.Close()
	}

	defer log.Info("renderer exiting")

	app.ApplyRender()

}
