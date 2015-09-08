<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<meta property="og:site_name" content="Sneaky Ben"/>
		<meta property="og:title" content="You are now Barack Obama, you must catch Ben Laden" />
		<meta property="og:description" content="Revivez la traque trépidante du terroriste le plus recherché du 21ème siècle !" />
		<meta property="og:image" content="http://sneakyben.fr/img/social.png" />
		<meta property="og:type" content="website" />
		<meta property="fb:app_id" content="316533765208478"/>
		<link rel="icon" type="image/x-icon" href="favicon.ico" />

		<title>Sneaky Ben</title>

		<link href="js/bootstrap/bootstrap.min.css" rel="stylesheet">
		<link href="js/social/social.css" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet">
	</head>
<body>

	<div class="container">
		<header id="header">
			<div id="music"></div>
			<a href="./" id="title"></a>
		</header>

		<section id="social">
			<div class="pull-right">
				<div class="fb-like" data-layout="button_count" data-action="like" data-share="true" data-width="450"></div>
			</div>
			<a href="https://twitter.com/intent/tweet?button_hashtag=SneakyBen" class="twitter-hashtag-button" data-lang="fr" data-related="IIM" data-url="http://sneakyben.fr">Tweet #SneakyBen</a>
			<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
			<a href="https://twitter.com/share" class="twitter-share-button" data-via="Tucsky" data-lang="fr" data-hashtags="SneakyBen">Tweeter</a>
			<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
		</section>

		<div id="game" class="waiting">
			<audio id="audio" src="loop/loop.mp3" preload="auto" loop="true"></audio>
			<div id="entities"></div>
			<div id="win" class="overlay">
				<div class="background">
					<video loop>
						<source class="source" type="video/mp4" src="videos/win.mp4" />
					</video>
				</div>
				<div class="content">
					<h1 class="text-center">You got Ben in <span class="score">0</span> seconds !</h1>
					<div class="social-sharing is-large" data-permalink="http://sneakyben.fr">
						<h1>Share your score with your friends!!</h1>
						<h5>Let's see if they can do better.</h5>
						<a href="#" class="share-facebook">
							<span class="icon icon-facebook"></span>
							<span class="share-title">Share</span>
							<span class="share-count">0</span>
						</a>

						<a href="#" class="share-twitter">
							<span class="icon icon-twitter"></span>
							<span class="share-title">Tweet</span>
							<span class="share-count">0</span>
						</a>

						<a href="#" class="share-pinterest">
							<span class="icon icon-pinterest"></span>
							<span class="share-title">Pin it</span>
							<span class="share-count">0</span>
						</a>

						<a href="#" class="share-google">
							<span class="icon icon-google"></span>
							<span class="share-count">+1</span>
						</a>
					</div>
					<div class="text-center">
						<button type="button" class="btn btn-success replay">REPLAY</button>
					</div>
				</div>
			</div>
			<div id="lose" class="overlay">
				<div class="background">
					<video loop>
						<source class="source" type="video/mp4" src="videos/lose.mp4" />
					</video>
				</div>
				<div class="content">
					<h1 class="text-center">You got rekt after <span class="score">0</span> seconds.</h1>
					<div class="social-sharing is-large">
						<h1>You better train fgt</h1>
						<h5>and share</h5>
						<a href="#" class="share-facebook">
							<span class="icon icon-facebook"></span>
							<span class="share-title">Share</span>
							<span class="share-count">0</span>
						</a>

						<a href="#" class="share-twitter">
							<span class="icon icon-twitter"></span>
							<span class="share-title">Tweet</span>
							<span class="share-count">0</span>
						</a>

						<a href="#" class="share-pinterest">
							<span class="icon icon-pinterest"></span>
							<span class="share-title">Pin it</span>
							<span class="share-count">0</span>
						</a>

						<a href="#" class="share-google">
							<span class="icon icon-google"></span>
							<span class="share-count">+1</span>
						</a>
					</div>
					<div class="text-center">
						<button type="button" class="btn btn-success replay">REPLAY</button>
					</div>
				</div>
			</div>
		</div>

		<section id="top">
			<table class="table table-striped">
				<thead>
					<tr>
						<th>#</th>
						<th>Nickname</th>
						<th>When</th>
						<th>Seconds</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ($scores as $score): ?>
					<tr<?= $score->you ? ' class="you"' : ''; ?>>
						<td><?= $score->rank; ?></td>
						<td><?= $score->nickname; ?></td>
						<td data-ago="<?= $score->updated_at; ?>"></td>
						<td><?= str_replace('.', ',', (string) ($score->score/1000)).'s'; ?></td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</section>
	
		<footer id="footer">
			<nav>
				<a href="http://kevinrostagni.fr">Kevin Rostagni</a>
				<a href="http://ttial.com/">Gary Mengus</a>
				<a href="http://axel-ruffinetto.ovh/pf/">Axel Ruffinetto</a>
			</nav>
			<?php if (!$local): ?>
				<div class="compteur">
					<script type="text/javascript" src="http://counter2.allfreecounter.com/private/countertab.js?c=185f0ac08084e5f6fba2d08d04d3d65e"></script>
					<noscript>
						<a href="http://www.compteurdevisite.com" title="compteur pour site">
							<img src="http://counter2.allfreecounter.com/private/compteurdevisite.php?c=185f0ac08084e5f6fba2d08d04d3d65e" border="0" title="compteur pour site" alt="compteur pour site">
						</a>
					</noscript>
				</div>
			<?php endif; ?>
		</footer>
	</div>
	
	<script src="js/jquery/jquery.min.js"></script>
	<script src="js/jquery/jquery-ui.min.js"></script>
	<script src="js/jquery.cookie/jquery.cookie.js"></script>
	<script src="js/bootstrap/bootstrap.min.js"></script>
	<script src="js/social/social.js"></script>
	<script src="js/momentjs/moment.js"></script>
	<script src="js/hammer/hammer.js"></script>
	<script src="js/hammer/jquery.hammer.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/game.min.js"></script>
	<?php if (!$local): ?>
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-45598000-4', 'auto');
			ga('send', 'pageview');
		</script>
	<?php endif; ?>

	<script>
		window.fbAsyncInit = function() {
			FB.init({
			appId      : '316533765208478',
			xfbml      : true,
			version    : 'v2.2'
			});
		};

		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script>
</body>
</html>