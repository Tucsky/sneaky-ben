<?php
	
	$container = new Illuminate\Container\Container;
	$connFactory = new \Illuminate\Database\Connectors\ConnectionFactory($container);
	$conn = $connFactory->make($settings['database']);
	$resolver = new \Illuminate\Database\ConnectionResolver();
	$resolver->addConnection('default', $conn);
	$resolver->setDefaultConnection('default');
	\Illuminate\Database\Eloquent\Model::setConnectionResolver($resolver);