CREATE DATABASE pool;

USE pool;

CREATE TABLE team (
  team_id int(11) NOT NULL AUTO_INCREMENT,
  team_name varchar(45) DEFAULT NULL,
  pub_name varchar(45) DEFAULT NULL,
  PRIMARY KEY (team_id),
  UNIQUE KEY team_id_UNIQUE (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE team_match (
  match_id int(11) NOT NULL AUTO_INCREMENT,
  home_team_id int(11) NOT NULL,
  away_team_id int(11) NOT NULL,
  home_score int(11) DEFAULT NULL,
  away_score int(11) DEFAULT NULL,
  PRIMARY KEY (match_id),
  KEY home_team_fk_idx (home_team_id),
  KEY away_team_fk_idx (away_team_id),
  CONSTRAINT away_team_fk FOREIGN KEY (away_team_id) REFERENCES team (team_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT home_team_fk FOREIGN KEY (home_team_id) REFERENCES te  am (team_id) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE player (
  player_id int(11) NOT NULL AUTO_INCREMENT,
  player_name varchar(45) NOT NULL,
  team_id int(11) DEFAULT NULL,
  PRIMARY KEY (player_id),
  KEY team_id_idx (team_id),
  CONSTRAINT team_id_fk FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE team_match_record (
  match_record_id int(11) NOT NULL AUTO_INCREMENT,
  match_id int(11) NOT NULL,
  home_player_id int(11) NOT NULL,
  away_player_id int(11) NOT NULL,
  home_score int(11) NOT NULL,
  away_score int(11) NOT NULL,
  home_seven_balls int(11) DEFAULT NULL,
  away_seven_balls int(11) DEFAULT NULL,
  match_number int(11) NOT NULL,
  PRIMARY KEY (match_record_id),
  KEY match_id_fk_idx (match_id),
  KEY home_player_id_fk_idx (home_player_id),
  KEY away_player_id_fk_idx (away_player_id),
  CONSTRAINT away_player_id_fk FOREIGN KEY (away_player_id) REFERENCES player (player_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT home_player_id_fk FOREIGN KEY (home_player_id) REFERENCES player (player_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT match_id_fk FOREIGN KEY (match_id) REFERENCES team_match (match_id) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
