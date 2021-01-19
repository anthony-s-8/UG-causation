/* create timeline */
var accept_timeline = [];
var ACCEPT_TRIALS = 0;

/* instructions trials */
var instructions_pages_accept = [
	"<p>Please pay attention and carefully read the following instructions.</p><p>In this study, you are going to play a game. " +
	"There are two players: you, and a partner. In every round of this game, you and your partner receive " + stakes_txt + " ($" + stakes.toFixed(2) +
	"), and you must decide how to split it between the two of you.</p><br><p>Here's how it works:</p>",
	"<p>First, your partner will offer you some portion of the money.</p><p>They can offer you any amount between $0.00 and $" + stakes.toFixed(2) + ".</p>",
	"<p>Once your partner makes an offer, you may either accept or reject this offer.</p>" +
	"<p>If you accept the offer, then you will receive the amount of money offered to you, and your partner will get the rest.</p>" +
	"<p>If you reject the offer, then nobody gets any money in that round.</p><br>",
	"<p>Since you will be playing this game many times, you will <b>not</b> receive money from every round of the game.</p>" +
	"<p><b>But, you will receive the amount of money that you earn from a randomly selected round of the game as a bonus. </b>" +
	"For example, if you accepted an offer of $5.00 on the randomly chosen round, you will receive a bonus of $5.00 after the study is completed. " +
	"But, if you rejected your partner's offer of $5.00, you will receive no bonus at all.</p>" +
	"<p><b>So, make sure to play each round like real money is up for grabs- you never know which round of the game you will get a bonus from!</b></p>",
	"<p>In addition to clicking on the buttons, you may use the left and right arrow keys to make quicker responses.</p>",
	"<img src='img/red_player.png' height='" + stim_size + "'>" +
	"<img src='img/yellow_player.png' height='" + stim_size + "'>" +
	"<img src='img/blue_player.png' height='" + stim_size + "'>" +
	"<p>In each round of the game, " +
	"you will play with one of three partners: Red, Yellow, or Blue. " +
	"Before each round, you will be told which partner you are playing with.</p>"];

if (learnBlocks > 1) {
	instructions_pages_accept.push("<p>One last thing: we want to learn what you think of the different players in this game. " +
		"So, we'll alternate between playing the game for a few rounds and asking what you think of the players.</p>",
    "<p>To do so, we will first tell you which partner you are playing with.</p>" +
    "<p>Then you'll be shown two possible offers, and you will be asked:</p><br><p>\"Which offer is more likely?\"</p><br>" +
    "<p><b>Please choose the offer amount that your partner is most likely to have offered.</b></p>",
    "<p>Sometimes it may seem like both offers are equally likely. " +
    "Even if it's hard to tell, try to pick the offer that feels most likely. " +
    "You do not need to spend too much time thinking about each choice.</p>");
}

var instructions_accept = {
  type: 'instructions',
  pages: instructions_pages_accept.concat("You're now finished with the instructions."),
  show_clickable_nav: true
};

var instructions_mcmc_accept = {
  type: 'instructions',
  pages: ["<p>Great work!</p><br><p>Now, we want to learn what you think of the different players in this game.</p>",
          "<p>To do so, we will first tell you which partner you are playing with.</p>" +
          "<p>Then you'll be shown two possible offers, and you will be asked:</p><br><p>\"Which offer is more likely?\"</p><br>" +
          "<p><b>Please choose the offer amount that your partner is most likely to have offered.</b></p>",
          "<p>Sometimes it may seem like both offers are equally likely. " +
          "Even if it's hard to tell, try to pick the offer that feels most likely. " +
          "You do not need to spend too much time thinking about each choice.</p>"],
  show_clickable_nav: true
};

if (!TEST) {
  //accept_timeline.push(instructions_accept);
  //ACCEPT_TRIALS = ACCEPT_TRIALS + 1;
}

/* Display check questions and loop until correct */
var check_choices = ["You get the amount of money specified in the offer, but your partner gets nothing.",
                     "Neither player receives any money",
                     "Your partner gets the amount of money specified in the offer, and you get the rest.",
                     "You get the amount of money specified in the offer, and your partner gets the rest."];
if (!TEST) {
  //accept_timeline.push(check_q("check1", "Check question: what happens when you accept an offer?", check_choices, 3),
	//	                   check_q("check2", "Check question: what happens when you reject an offer?", check_choices, 1));
  //ACCEPT_TRIALS = ACCEPT_TRIALS + 2;
}

// Ask for a causal judgment after the player accepts/rejects
var accept_cause = {
  type: 'html-slider-response',
  stimulus: function () {
    d = jsPsych.data.getLastTrialData().values()[0];
		color = d.response == 'accept' ? "green" : "red";
    return avatar() + "<p>You have <span style='color:" +
			color + ";font-weight:bold;'>" + d.response + "ed</span> " +
      d.player + "'s offer of $" + d.offer +
      " out of $" + stakes.toFixed(2) + ".<p>" +
      "As a result, you have earned <span style='color:" + color +";font-weight:bold;'>$" +
			d.earned + ".</p><br>" +
      "<p><b>To what extent did you earn $" + d.earned +
      " in this round because " + d.player +
      " made an offer of $" + d.offer + "?</b></p>"
  },
  labels: ["not at all", "totally"],
  trial_duration: TRIAL_DURATION,
  on_finish: function (data) {
    d = jsPsych.data.getLastTrialData().values()[0];
    data.player = jsPsych.timelineVariable('player', true);
    data.trait = jsPsych.timelineVariable('trait', true);
    data.alpha = jsPsych.timelineVariable('alpha', true);
    data.beta = jsPsych.timelineVariable('beta', true);
    data.offer = jsPsych.timelineVariable('offer', true);
    data.prob = jStat.beta.pdf(data.offer / stakes,
                               jsPsych.timelineVariable('alpha', true),
                               jsPsych.timelineVariable('beta', true));
    data.measure = "cause";
  }
};
var accept_confidence = {
  type: 'html-slider-response',
  stimulus: function () {
    d = jsPsych.data.get().last(2).first(1).values()[0];
    d2 = jsPsych.data.getLastTrialData().values()[0];
    return avatar() + "<p>You have <span style='color:" +
			color + ";font-weight:bold;'>" + d.response + "ed</span> " +
      d.player + "'s offer of $" + d.offer +
      " out of $" + stakes.toFixed(2) + ".<p>" +
      "As a result, you have earned <span style='color:" + color +";font-weight:bold;'>$" +
			d.earned + ".</p><br>" +
      "<p><b>To what extent did you earn $" + d.earned +
      " in this round because " + d.player +
      " made an offer of $" + d.offer + "?</b></p>" +
      '<div class="jspsych-image-slider-response-container" style="position:relative; margin: 0 auto 3em auto;">' +
      "<input type='range' disabled='true' style='width: 100%' value='" + d2.response + "'>" +
      '<div><div style="display: inline-block; position: absolute; left:-50%; text-align: center; width: 100%;">' +
      '<span style="text-align: center; font-size: 80%;">not at all</span></div>' +
      '<div style="display: inline-block; position: absolute; left:50%; text-align: center; width: 100%;">' +
      '<span style="text-align: center; font-size: 80%;">totally</span></div></div></div><br>' +
      "<p><b>How confident are you in your response to the previous question?</b></p>"
  },
  labels: ["not at all", "totally"],
  trial_duration: TRIAL_DURATION,
  post_trial_gap: POST_TRIAL_GAP,
  on_finish: function (data) {
    data.player = jsPsych.timelineVariable('player', true);
    data.trait = jsPsych.timelineVariable('trait', true);
    data.alpha = jsPsych.timelineVariable('alpha', true);
    data.beta = jsPsych.timelineVariable('beta', true);
    data.offer = jsPsych.timelineVariable('offer', true);
    data.prob = jStat.beta.pdf(data.offer / stakes,
                               jsPsych.timelineVariable('alpha', true),
                               jsPsych.timelineVariable('beta', true));
    data.measure = "confidence";
  }
};

var accept_feedback = {
  type: 'instructions',
  trial_duration: TRIAL_DURATION,
  show_clickable_nav: true,
  post_trial_gap: POST_TRIAL_GAP,
  pages: function () {
    d = jsPsych.data.getLastTrialData().values()[0];
		color = d.response == 'accept' ? "green" : "red";
    return [avatar() + "<p>You have <span style='color:" +
						color + ";font-weight:bold;'>" + d.response + "ed</span> " +
            d.player + "'s offer of $" + d.offer +
            " out of $" + stakes.toFixed(2) + ".<p>" +
            "As a result, you have earned <span style='color:" + color +";font-weight:bold;'>$" +
						d.earned + ".</p><br>"];
  }
};

// learning trials
function accept_learn_trial(n, stage, cause=false) {
	let params = learnParams(n);

  let UGtrial = {
    type: 'html-button-response',
    stimulus: function () {
      return avatar() + "<p>You are now playing with " +
        jsPsych.timelineVariable('player', true) + ".</p><p>" +
        jsPsych.timelineVariable('player', true) + " has offered you $" +
        jsPsych.timelineVariable('offer', true) + " out of $" +
        stakes.toFixed(2) + ".</p>" +
        "<p>Do you accept this offer?</p><br>"
    },
    choices: ["Yes", "No"],
    trial_duration: TRIAL_DURATION,
    button_html: LR_BUTTONS,
    on_start: ALLOW_KEYPRESS,
    on_finish: function (data) {
      DISABLE_KEYPRESS();
      data.measure = "UG";
      data.player = jsPsych.timelineVariable('player', true);
      data.trait = jsPsych.timelineVariable('trait', true);
      data.alpha = jsPsych.timelineVariable('alpha', true);
      data.beta = jsPsych.timelineVariable('beta', true);
      data.offer = jsPsych.timelineVariable('offer', true);
      data.prob = jStat.beta.pdf(data.offer / stakes,
                                 jsPsych.timelineVariable('alpha', true),
                                 jsPsych.timelineVariable('beta', true));
      data.accept = data.button_pressed == 0;
      if (data.accept) {
        data.response = "accept";
        data.earned = jsPsych.timelineVariable('offer', true);
      } else {
        data.response = "reject";
        data.earned = "0.00";
      }
    }
  };

  return {
    timeline_variables: params,
    randomize_order: true,
    data: {stage: stage},
    timeline: (cause ? [UGtrial, accept_cause, accept_confidence] : [UGtrial, accept_feedback])
  };
}

function accept_mcmc_trial(n) {
	// create parameters for a single trial for each player/chain
	let params = players.map(function (player) {
	  arr = Array(mcmcChains);
	  for (c = 0; c < mcmcChains; c++) {
			arr[c] = { ...player }; // copy the player Object to avoid mutation
			arr[c].choices = ["$" + (jStat.beta.sample(player.alpha, player.beta) * stakes).toFixed(2),
			          				"$" + (jStat.beta.sample(player.alpha, player.beta) * stakes).toFixed(2)];
			arr[c].chain = c+1;
	  }
	  return arr;
	}).flat();

	return {
	  timeline_variables: params,
	  repetitions: n,
	  randomize_order: true,
	  data: {stage: 2, measure: "mcmc"},
	  timeline: [{
	    type: 'html-button-response',
	    stimulus: function () {
	      return avatar() + "<p>Which offer is " +
	        jsPsych.timelineVariable('player', true) +
	        " more likely to make?</p>"
	    },
	    choices: function () {
	      let c = jsPsych.timelineVariable('choices', true);
	      lastTrial = jsPsych.data.get().filter({
					stage: 2,
	        player: jsPsych.timelineVariable('player', true),
	        chain: jsPsych.timelineVariable('chain', true)
	      }).last(1).values()[0];

	      // If possible, use the last response as the Markov state
	      if (lastTrial != undefined) {
	        c[0] = lastTrial.response;
	      }

	      // Sample the alternative choice using a proposal distribution
	      c[1] = "$" + sampleOffer(c[0]).toFixed(2);
	      while (c[1] == c[0]) {
	        c[1] = "$" + sampleOffer(c[0]).toFixed(2);
	      }

	      return [...jsPsych.randomization.shuffle(c)];
	    },
	    trial_duration: TRIAL_DURATION,
	    post_trial_gap: POST_TRIAL_GAP,
	    button_html: LR_BUTTONS,
	    on_start: ALLOW_KEYPRESS,
	    on_finish: function(data) {
	      DISABLE_KEYPRESS();
	      data.choices = jsPsych.currentTrial().choices;
	      data.response = data.choices[data.button_pressed];
	      data.player = jsPsych.timelineVariable('player', true);
	      data.trait = jsPsych.timelineVariable('trait', true);
	      data.alpha = jsPsych.timelineVariable('alpha', true);
	      data.beta = jsPsych.timelineVariable('beta', true);
	      data.chain = jsPsych.timelineVariable('chain', true);
	    }
	  }]
	};
}


if (learnBlocks == 1) {
	// add learning trials all at once
	if (learnTrials > 0) {
	  let trials = accept_learn_trial(learnTrials, stage=1, cause=false);
	  accept_timeline.push(trials);
	  ACCEPT_TRIALS = ACCEPT_TRIALS + trials.timeline_variables.length * trials.timeline.length;
	}

	// Instructions for MCMC section
	if (!TEST) {
	  accept_timeline.push(instructions_mcmc_accept);
	  ACCEPT_TRIALS = ACCEPT_TRIALS + 1;
	}

	// add MCMC trials all at once
	if (mcmcTrials > 0) {
		let trials = accept_mcmc_trial(mcmcTrials);
	  accept_timeline.push(trials);
	  ACCEPT_TRIALS = ACCEPT_TRIALS + trials.repetitions * trials.timeline_variables.length;
	}
} else if (learnBlocks > 1) {
	for (i=0; i<learnBlocks; i++) {
		// add learning trials for this block
		let learn_trials = accept_learn_trial(learnBlockTrials, stage=1, cause=false);
		accept_timeline.push(learn_trials);
		ACCEPT_TRIALS = ACCEPT_TRIALS + learn_trials.timeline_variables.length * learn_trials.timeline.length;

		// add mcmc trials for this block
		let mcmc_trials = accept_mcmc_trial(mcmcBlockTrials);
	  accept_timeline.push(mcmc_trials);
	  ACCEPT_TRIALS = ACCEPT_TRIALS + mcmc_trials.repetitions * mcmc_trials.timeline_variables.length;
  }
}





// Instructions for test section
var instructions_test_accept = {
  type: 'instructions',
  pages: ["<p>Great work!</p><br><p>Finally, in this last phase, you're going to play the game a few more times.</p>",
          "<p>Now, after each round of the game, you'll be asked the extent to which you did or did not make money " +
          "in that round because your partner made that particular offer as opposed to some other offer.</p>" +
          "<p>Then you'll be asked to rate how confident you are in that judgment.</p>" +
          "<p><b>Please rate how much your partner's offer caused you to make or not make money in each round.<b></p>"],
  show_clickable_nav: true
};
if (!TEST) {
  accept_timeline.push(instructions_test_accept);
  ACCEPT_TRIALS = ACCEPT_TRIALS + 1;
}

// test trials
if (testTrials > 0) {
  let testParams = players.map(function (player) {
    return [...Array(testTrials).keys()].map(function (i) {
			let o = { ...player };
			o.offer = (stakes * (i / (testTrials-1))).toFixed(2);
			return o;
    });
  }).flat();

  let trials = accept_learn_trial(testParams, stage=3, cause=true);
  accept_timeline.push(trials);
  ACCEPT_TRIALS = ACCEPT_TRIALS + trials.timeline_variables.length * trials.timeline.length;
}
