<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DockerIps extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'docker:ips';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get container Ips';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info("Docker Containers IP");
        exec("docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)b");
    }
}
