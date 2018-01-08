-- Up 
CREATE TABLE IF NOT EXISTS player(id integer not null primary key, name varchar(100) not null, tag varchar(10), idx integer, discord_id varchar(100));
CREATE TABLE IF NOT EXISTS module(id integer not null primary key, name varchar(20) not null, rank integer not null, res1 varchar2(20), res2 varchar2(20), res3 varchar2(20), idx integer);
CREATE TABLE IF NOT EXISTS hull(id integer not null primary key, name varchar(20) not null, rank integer not null, idx integer);
CREATE TABLE IF NOT EXISTS turret(id integer not null primary key, name varchar(20) not null, eng_name varchar(20), rank integer not null, idx integer);
CREATE TABLE IF NOT EXISTS player_modules(
  idplayer integer not null, 
  idmodule integer not null, 
  time_played integer not null, 
  mu integer,
  crdate datetime default CURRENT_TIMESTAMP,
  FOREIGN KEY(idplayer) REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(idmodule) REFERENCES module(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS player_hulls(
  idplayer integer not null, 
  idhull integer not null, 
  time_played integer not null, 
  mu integer,
  crdate datetime default CURRENT_TIMESTAMP,
  FOREIGN KEY(idplayer) REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(idhull) REFERENCES hull(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS player_turrets(
  idplayer integer not null, 
  idturret integer not null, 
  time_played integer not null, 
  mu integer,
  crdate datetime default CURRENT_TIMESTAMP,
  FOREIGN KEY(idplayer) REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(idturret) REFERENCES turret(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Down
DROP TABLE turret;
DROP TABLE hull;
DROP TABLE module;
DROP TABLE player;
DROP TABLE player_modules;
DROP TABLE player_hulls;
DROP TABLE player_turrets;