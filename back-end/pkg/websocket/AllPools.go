package websocket

import (
	"fmt"
	"strconv"
)

type AllPools struct {
	Pools      map[*Pool]bool
	Register   chan *Pool
	Unregister chan *Pool
}

func NewAllPool() *AllPools {
	return &AllPools{
		Register:   make(chan *Pool),
		Unregister: make(chan *Pool),
		Pools:      make(map[*Pool]bool),
	}
}

func (p *AllPools) Start() {
	for {
		select {
		case pool := <-p.Register:
			p.Pools[pool] = true
			fmt.Println("Number of Pools: ", len(p.Pools))
			break
		}
	}
}

func (p *AllPools) Check(room string) *Pool {
	for pool, _ := range p.Pools {
		if r := strconv.Itoa(pool.ID); r == room {
			return pool
		}
	}
	return nil
}
