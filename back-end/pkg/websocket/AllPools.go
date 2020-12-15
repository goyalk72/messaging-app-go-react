package websocket

import (
	"fmt"
)

type AllPools struct {
	Pools      map[*Pool]bool
	Register   chan *Pool
	Unregister chan *Pool
}

func NewAllPools() *AllPools {
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
		case pool := <-p.Unregister:
			delete(p.Pools, pool)
			fmt.Println("Number of pools : ", len(p.Pools))
			break
		}
	}
}

func (p *AllPools) Check(room int) *Pool {
	for pool, _ := range p.Pools {
		if pool.ID == room {
			return pool
		}
	}
	return nil
}
