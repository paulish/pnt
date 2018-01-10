-- Up 
CREATE TABLE IF NOT EXISTS player_rating(
  idplayer integer not null primary key,
  crystals integer,
  golds integer,
  score integer,
  old_crystals integer,
  old_golds integer,
  old_score integer,
  crdate datetime default CURRENT_TIMESTAMP,  
  FOREIGN KEY(idplayer) REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE  
);
-- Down
DROP TABLE player_rating;