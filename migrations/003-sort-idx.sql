-- Up 

ALTER TABLE MODULE ADD idx INTEGER;
ALTER TABLE HULL ADD idx INTEGER;
ALTER TABLE TURRET ADD idx INTEGER;

-- Down

ALTER TABLE MODULE DROP idx;
ALTER TABLE HULL DROP idx;
ALTER TABLE TURRET DROP idx;