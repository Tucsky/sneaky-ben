<?php
	require '../vendor/autoload.php';

	# Global configuration
	include '../app/settings.php';

	# Bootstrap eloquent
	require '../app/bootstrap.php';

	# Require models
	require '../app/models/Score.php';

	$app = new \Slim\Slim($settings);

	$app->notFound(function () use ($app) {
		$app->render('404.php');
	});

	$app->get('/', function() use ($app) {
		$local = in_array($_SERVER['REMOTE_ADDR'], array(
			'localhost',
			'127.0.0.1',
			'::1'
		));

		$scores = Score::orderBy('score', 'ASC')->get();
		$user = $app->request->cookies;
		$i = 0;
		foreach ($scores as $score) {
			if (isset($user['unique']) && $user['unique'] == $score->user) $score->you = true;
			$score->rank = ++$i;
		}
		$app->render('index.php', array('scores' => $scores, 'local' => $local));
	});

	$app->post('/score', function() use ($app) {
		header("Content-Type: application/json");
		if (in_array($_SERVER['REMOTE_ADDR'], array(
			'localhost',
			'127.0.0.1',
			'::1'
		))) {
			echo json_encode(array(
				'success' => false,
				'error' => 'local.'
			));
			exit;
		}

		$score = intval($app->request()->params('score'));
		$nickname = $app->request()->params('nickname');
		$user = $app->request->cookies;

		if (isset($user['unique']) && mb_strlen($user['unique']) === 16 && count($records = Score::where('user', '=', $user['unique'])->get()) && ($record = $records[0])) {
			if ($record->score <= $score) {
				echo json_encode(array(
					'success' => false,
					'error' => 'Ton score est trop pété, désolé.'
				));
				exit;
			}
			$record->updated_at = new DateTime();
			$record->score = $score;
			if ($nickname) $record->nickname = $nickname;

			if ($record->save()) {
				echo json_encode(array(
					'success' => true,
					'score' => $score,
					'id' => $record->id
				));
				exit;
			} else {
				echo json_encode(array(
					'success' => false
				));
				exit;
			}
		} else {
			$record = new Score;
			$record->created_at = new DateTime();
			$record->updated_at = new DateTime();
			$record->user = isset($user['unique']) ? $user['unique'] : null;
			$record->nickname = $nickname ? $nickname : 'Yolo!';
			$record->score = $score;

			if ($record->save()) {
				echo json_encode(array(
					'success' => true,
					'score' => $score,
					'id' => $record->id
				));
				exit;
			} else {
				echo json_encode(array(
					'success' => false
				));
				exit;
			}
		}
	});

	$app->run();