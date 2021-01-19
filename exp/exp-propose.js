/* create timeline */
var propose_timeline = [];
var PROPOSE_TRIALS = 0;

/* Display instructions trials */
var instructions_pages_propose = [
	"<p>Please pay attention and carefully read the following instructions.</p><p>In this HIT, you are going to play a game. " +
	"There are two players: you, and a partner. In every round of this game, you and your partner receive " + stakes_txt + " ($" + stakes.toFixed(2) +
	"), and you must decide how to split it between the two of you.</p><br><p>Here's how it works:</p>",
	"<p>First, you will offer your partner some portion of the money.</p><p>You can offer them any amount between $0.00 and $" + stakes.toFixed(2) + ".</p>",
	"<p>Once you make an offer, your partner may either accept or reject this offer.</p>" +
	"<p>If they accept the offer, then they will receive the amount of money you offered to them, and you will get the rest. " +
	"All of the money you earn through this game will be provided as a bonus after you complete the survey.</p>" +
	"<p>If you reject the offer, then nobody gets any money in that round.</p>",
	"<img src='img/red_player.png' height='" + stim_size + "'>" +
	"<img src='img/yellow_player.png' height='" + stim_size + "'>" +
	"<img src='img/blue_player.png' height='" + stim_size + "'>" +
	"<br><p>In each round of the game, you will play with one of three partners: Red, Yellow, or Blue. " +
	"Before each round, you will be told which partner you are playing with.</p>"];

"<p>Great work!</p><br><p>Now, we want to learn what you think of the different players in this game.</p>",
"<p>To do so, we will tell you which partner you are playing with, and how much you have offered them.</p>" +
"<p>Then you will be asked:</p><br><p>\"How likely is this player to accept this offer?\"</p><br>" +
"<p>Please determine how likely it is for your partner to accept that offer.</p>"

if (learnBlocks > 1) {
	instructions_pages_propose.push("<p>One last thing: we want to learn what you think of the different players in this game. " +
		"So, we'll alternate between playing the game for a few rounds and asking what you think of the players.</p>",
    "<p>To do so, we will tell you which partner you are playing with, and how much you have offered them.</p>" +
    "<p>Then you will be asked:</p><br><p>\"How likely is this player to accept this offer?\"</p><br>" +
    "<p><b>Please determine how likely it is for your partner to accept that offer.</b></p>",
    "<p>Sometimes it may seem hard to say how likely a player is to accept an offer. " +
    "Even if it's hard to tell, try to pick the number that feels most likely. " +
    "You do not need to spend too much time thinking about each choice.</p>");
}

var instructions_propose = {
  type: 'instructions',
  show_clickable_nav: true,
  pages: instructions_pages_propose.concat("You're now finished with the instructions.")
};
if (!TEST) {
  propose_timeline.push(instructions_propose);
  PROPOSE_TRIALS = PROPOSE_TRIALS + 1;
}

/* Instructions for MCMC section */
var instructions_mcmc_propose = {
  type: 'instructions',
  show_clickable_nav: true,
  pages: ["<p>Great work!</p><br><p>Now, we want to learn what you think of the different players in this game.</p>",
          "<p>To do so, we will tell you which partner you are playing with, and how much you have offered them.</p>" +
          "<p>Then you will be asked:</p><br><p>\"How likely is this player to accept this offer?\"</p><br>" +
          "<p>Please determine how likely it is for your partner to accept that offer.</p>"
   ]
};

/* Display check questions and loop until correct */
var check_choices = ["Your partner gets the amount of money specified in the offer, but you get nothing.",
            		     "Neither player receives any money",
            		     "Your partner gets the amount of money specified in the offer, and you get the rest.",
            		     "You get the amount of money specified in the offer, and your partner gets the rest."];
if (!TEST) {
  propose_timeline.push(check_q("check1", "Check question: what happens when your partner accepts an offer?", check_choices, 2),
		                    check_q("check2", "Check question: what happens when your partner rejects an offer?", check_choices, 1));
  PROPOSE_TRIALS = PROPOSE_TRIALS + 2;
}

var propose_cause = {
  type: 'html-slider-response',
  stimulus: function () {
    d = jsPsych.data.getLastTrialData().values()[0]
    return avatar() +
      "<p>You have offered " + d.player + " $" +
      d.offer.toFixed(2) + " out of $" + stakes.toFixed(2) +".</p>" +
      "<p>" + d.player + " has " + d.response + "ed your offer. " +
      "As a result, you have earned $" + d.earned.toFixed(2) + ".</p>" +
      "<p><b>To what extent did " + d.player +
      " " + d.response + "ing your offer of $" + d.offer.toFixed(2) +
      " cause you to earn $" + d.earned.toFixed(2) + " in this round?</b></p><br>"
  },
  data: {measure: "cause"},
  trial_duration: TRIAL_DURATION,
  labels: ["not at all", "totally"],
  on_finish: function (data) {
    data.player = jsPsych.timelineVariable('player', true);
    data.trait = jsPsych.timelineVariable('trait', true);
    data.alpha = jsPsych.timelineVariable('alpha', true);
    data.beta = jsPsych.timelineVariable('beta', true);
    data.offer = parseFloat(data.response);
    data.prob = jStat.beta.cdf(data.offer / stakes,
                               jsPsych.timelineVariable('alpha', true),
                               jsPsych.timelineVariable('beta', true))
  }
};
var propose_confidence = {
  type: 'html-slider-response',
  stimulus: function () {
    d = jsPsych.data.get().last(2).first(1).values()[0];
    d2 = jsPsych.data.getLastTrialData().values()[0];
    return avatar() +
      "<p>You have offered " + d.player + " $" +
      d.offer.toFixed(2) + " out of $" + stakes.toFixed(2) +".</p>" +
      "<p>" + d.player + " has " + d.response + "ed your offer. " +
      "As a result, you have earned $" + d.earned.toFixed(2) + ".</p>" +
      "<p>To what extent did " + d.player +
      " " + d.response + "ing your offer of $" + d.offer.toFixed(2) +
      " cause you to earn $" + d.earned.toFixed(2) + " in this round?</p><br>" +
      '<div class="jspsych-image-slider-response-container" style="position:relative; margin: 0 auto 3em auto;">' +
      "<input type='range' disabled='true' style='width: 100%' value='" + d2.response + "'>" +
      '<div><div style="display: inline-block; position: absolute; left:-50%; text-align: center; width: 100%;">' +
      '<span style="text-align: center; font-size: 80%;">not at all</span></div>' +
      '<div style="display: inline-block; position: absolute; left:50%; text-align: center; width: 100%;">' +
      '<span style="text-align: center; font-size: 80%;">totally</span></div></div></div><br><br>' +
      "<p><b>How confident are you in your response to the previous question?</b></p><br>"
  },
  data: {measure: "confidence"},
  trial_duration: TRIAL_DURATION,
  labels: ["not at all", "totally"],
  on_finish: function (data) {
    data.player = jsPsych.timelineVariable('player', true);
    data.trait = jsPsych.timelineVariable('trait', true);
    data.alpha = jsPsych.timelineVariable('alpha', true);
    data.beta = jsPsych.timelineVariable('beta', true);
    data.offer = parseFloat(data.response);
    data.prob = jStat.beta.cdf(data.offer / stakes,
                               jsPsych.timelineVariable('alpha', true),
                               jsPsych.timelineVariable('beta', true))
  }
};
var propose_feedback = {
  type: 'instructions',
  show_clickable_nav: true,
  pages: function () {
    d = jsPsych.data.getLastTrialData().values()[0]
    return [avatar() + "<p>You have offered " + d.player + " $" +
            d.offer.toFixed(2) + " out of $" + stakes.toFixed(2) +".</p>" +
            "<p>" + d.player + " has " + d.response + "ed your offer. " +
            "As a result, you have earned $" + d.earned.toFixed(2) + ".</p>"];
  }
};

function propose_trial(n, stage, cause=false) {
	let params = learnParams(n);

  let UGtrial = {
    type: 'html-slider-response',
    stimulus: function () {
     return avatar() + "<p>You are now playing with " +
       jsPsych.timelineVariable('player', true) + ".</p><p>" +
       "How much would you like to offer " +
       jsPsych.timelineVariable('player', true) + "?</p>"
    },
    labels: ["$0.00", "$" + stakes.toFixed(2)],
    data: {measure: "offer"},
    max: stakes, step: 0.01, start: stakes/2.0,
    trial_duration: TRIAL_DURATION,
    on_finish: function (data) {
      data.player = jsPsych.timelineVariable('player', true);
      data.trait = jsPsych.timelineVariable('trait', true);
      data.alpha = jsPsych.timelineVariable('alpha', true);
      data.beta = jsPsych.timelineVariable('beta', true);
      data.offer = parseFloat(data.response);
      data.prob = jStat.beta.cdf(data.offer / stakes,
                				        jsPsych.timelineVariable('alpha', true),
                				        jsPsych.timelineVariable('beta', true))

      data.accept = Math.random() < data.prob;
      if (data.accept) {
        data.response = 'accept';
        data.earned = stakes - data.offer;
      } else {
        data.response = 'reject';
        data.earned = 0.00;
      }
    }
  };

  return {
    timeline_variables: params,
    randomize_order: true,
    data: {stage: stage},
    timeline: (cause ? [UGtrial, propose_cause, propose_confidence] : [UGtrial, propose_feedback])
  };
}


var choices;  // use this var to keep track of the choices on every MCMC trial
/* MCMC trials */
function propose_mcmc_trial(n) {
	let params = players.map(function (player) {
    return [...Array(n * mcmcChains).keys()].map(function (i) {
      let o = { ...player };
      o.offer = (stakes * (i / (n*mcmcChains-1))).toFixed(2);
      return o;
    });
  }).flat();

	return {
	  labels: ["not at all", "totally"],
	  timeline_variables: params,
	  trial_duration: TRIAL_DURATION,
	  randomize_order: true,
	  data: {stage: 2, measure: "mcmc"},
	  timeline: [{
	  	type: 'html-slider-response',
	  	stimulus: function () {
	      return avatar() + "<p>Suppose you have made an offer of $" +
	    		jsPsych.timelineVariable('offer', true).toFixed(2) +
	    		" to " + jsPsych.timelineVariable('player', true) +
	    		".</p><p>How likely are they to accept this offer?</p><br>"
	  	},
	  	on_finish: function(data) {
	  	    data.offer = jsPsych.timelineVariable('offer', true);
	  	    data.player = jsPsych.timelineVariable('player', true);
	  	    data.trait = jsPsych.timelineVariable('trait', true);
	  	    data.alpha = jsPsych.timelineVariable('alpha', true);
	  	    data.beta = jsPsych.timelineVariable('beta', true);
	  	}
	  }]
	};
}


if (learnBlocks == 1) {
	// add learning trials all at once
	if (learnTrials > 0) {
	  let trials = propose_learn_trial(learnTrials, stage=1, cause=false);
	  propose_timeline.push(trials);
	  PROPOSE_TRIALS = PROPOSE_TRIALS + trials.timeline_variables.length * trials.timeline.length;
	}

	// Instructions for MCMC section
	if (!TEST) {
	  propose_timeline.push(instructions_mcmc_propose);
	  PROPOSE_TRIALS = PROPOSE_TRIALS + 1;
	}

	// add MCMC trials all at once
	if (mcmcTrials.length > 0) {
		let trials = propose_mcmc_trial(mcmcTrials);
	  propose_timeline.push(trials);
	  PROPOSE_TRIALS = PROPOSE_TRIALS + trials.timeline_variables.length;
	}
} else if (learnBlocks > 1) {
	for (i=0; i<learnBlocks; i++) {
		// add learning trials for this block
		let learn_trials = propose_learn_trial(learnBlockTrials, stage=1, cause=false);
	  propose_timeline.push(learn_trials);
	  PROPOSE_TRIALS = PROPOSE_TRIALS + learn_trials.timeline_variables.length * learn_trials.timeline.length;

		// add mcmc trials for this block
		let mcmc_trials = propose_mcmc_trial(mcmcBlockTrials);
	  propose_timeline.push(mcmc_trials);
	  PROPOSE_TRIALS = PROPOSE_TRIALS + mcmc_trials.timeline_variables.length;
  }
}

// Instructions for test section
var instructions_test_propose = {
  type: 'instructions',
  pages: ["<p>Great work!</p><br><p>Finally, in this last phase, you're going to play the game a few more times.</p>",
          "<p>Now, after each round of the game, you'll be asked the extent to which your partner accepting or rejecting your offer caused you to make money or not in that round.</p>" +
          "<p>Then you'll be asked to rate how confident you are in that judgment.</p>" +
          "<p><b>Please rate how much your partner's decision to accept or reject your offer caused you to make money or not in each round.<b></p>"],
  show_clickable_nav: true
};
if (!TEST) {
  propose_timeline.push(instructions_test_propose);
  PROPSOE_TRIALS = PROPOSE_TRIALS + 1;
}

// test trials
if (testTrials > 0) {
	// idk what to do in test for propose condition
  let trials = propose_trial(testTrials, stage=3, cause=true);
  propose_timeline.push(trials);
  PROPOSE_TRIALS = PROPOSE_TRIALS + trials.timeline_variables.length * trials.timeline.length;
}
