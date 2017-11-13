-- Up 

INSERT INTO PLAYER (name, tag) VALUES ('paulish', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('A_G_R_O_N_O_M', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('SherXan', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('CkuJIJIa_HET', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('Kira-5let', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('K_H_9l_3_b-T_b_M_bl', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('Whisky', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('npocmume', 'PNT');
INSERT INTO PLAYER (name, tag) VALUES ('kratasuk85', 'PNT2');
INSERT INTO PLAYER (name, tag) VALUES ('6eru_OT-MeH9l', 'PNT2');
INSERT INTO PLAYER (name, tag) VALUES ('evgen150rus', 'PNT2');
INSERT INTO PLAYER (name, tag) VALUES ('egor55555_tankist', 'PNT2');
INSERT INTO PLAYER (name, tag) VALUES ('xxx_LLI_u_x_a_H_xxx', 'PNT2');
INSERT INTO PLAYER (name, tag) VALUES ('JART_7', 'PNT2');
INSERT INTO PLAYER (name, tag) VALUES ('KaBka3ckuu_TIJIeHHuk', 'PNT2');
INSERT INTO PLAYER (name, tag) VALUES ('KyKoJIkA', null);
INSERT INTO PLAYER (name, tag) VALUES ('D_O_H_6_A_C_C', null);
INSERT INTO PLAYER (name, tag) VALUES ('olga7410', null);
INSERT INTO PLAYER (name, tag) VALUES ('AleAnA', null);
INSERT INTO PLAYER (name, tag) VALUES ('Mex1111.ru', null);
INSERT INTO PLAYER (name, tag) VALUES ('SWALLOW_THE_SUN', null);

INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-B', 1, 'firebird', 'twins', 'ricochet', 1);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-F', 1, 'firebird', 'freeze', 'twins', 2);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-D', 1, 'firebird', 'freeze', 'thunder', 3);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-C', 1, 'freeze', 'shotgun', 'ricochet', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-A', 1, 'firebird', 'shotgun', 'twins', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-D', 2, 'shotgun', 'twins', 'ricochet', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Кодиак T-K', 2, 'freeze', 'rocket_launcher', 'artillery', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-F', 2, 'rocket_launcher', 'twins', 'ricochet', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Урса T-J', 3, 'twins', 'rocket_launcher', 'artillery', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-L', 3, 'freeze', 'shotgun', 'rocket_launcher', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-J', 3, 'firebird', 'isis', 'rocket_launcher', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-H', 3, 'freeze', 'ricochet', 'machine_gun', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Акула T-G', 3, 'ricochet', 'rocket_launcher', 'thunder', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-A', 3, 'firebird', 'freeze', 'shotgun', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Акула T-D', 3, 'twins', 'machine_gun', 'thunder', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Урса T-H', 3, 'isis', 'ricochet', 'artillery', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-A', 3, 'freeze', 'twins', 'smoky', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Акула T-A', 3, 'ricochet', 'machine_gun', 'thunder', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-E', 3, 'freeze', 'ricochet', 'smoky', NULL);

-- Down

DELETE FROM PLAYER;
DELETE FROM MODULE;