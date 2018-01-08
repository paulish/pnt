-- Up 

INSERT INTO PLAYER (name, tag, idx) VALUES ('paulish', 'PNT', 1);
INSERT INTO PLAYER (name, tag, idx) VALUES ('A_G_R_O_N_O_M', 'PNT', 2);
INSERT INTO PLAYER (name, tag, idx) VALUES ('Kira-5let', 'PNT', 3);
INSERT INTO PLAYER (name, tag, idx) VALUES ('K_H_9l_3_b-T_b_M_bl', 'PNT', 4);
INSERT INTO PLAYER (name, tag, idx) VALUES ('AMA3OHKA_B_TAHKE', 'PNT', 5);
INSERT INTO PLAYER (name, tag, idx) VALUES ('npocmume', 'PNT', 6);
INSERT INTO PLAYER (name, tag, idx) VALUES ('kratasuk85', 'PNT', 7);

INSERT INTO PLAYER (name, tag) VALUES ('KaBka3ckuu_TIJIeHHuk', 'nHm');
INSERT INTO PLAYER (name, tag) VALUES ('JART_7', 'nHm');
INSERT INTO PLAYER (name, tag) VALUES ('evgen150rus', 'nHm');
INSERT INTO PLAYER (name, tag) VALUES ('Pikassic', 'nHm');
INSERT INTO PLAYER (name, tag) VALUES ('6eru_OT-MeH9l', 'nHm');
INSERT INTO PLAYER (name, tag) VALUES ('xxx_LLI_u_x_a_H_xxx', 'nHm');
INSERT INTO PLAYER (name, tag) VALUES ('egor55555_tankist', 'nHm');

INSERT INTO PLAYER (name, tag) VALUES ('CkuJIJIa_HET', null);
INSERT INTO PLAYER (name, tag) VALUES ('KyKoJIkA', null);
INSERT INTO PLAYER (name, tag) VALUES ('D_O_H_6_A_C_C', null);
INSERT INTO PLAYER (name, tag) VALUES ('olga7410', null);
INSERT INTO PLAYER (name, tag) VALUES ('AleAnA', null);
INSERT INTO PLAYER (name, tag) VALUES ('Ms.Sharm', null);
INSERT INTO PLAYER (name, tag) VALUES ('Mr.Shram', null);
INSERT INTO PLAYER (name, tag) VALUES ('9I_CAH9I', null);
INSERT INTO PLAYER (name, tag) VALUES ('gergu100', null);
INSERT INTO PLAYER (name, tag) VALUES ('serg-13021975', null);
--INSERT INTO PLAYER (name, tag) VALUES ('Mex1111.ru', null);
--INSERT INTO PLAYER (name, tag) VALUES ('SWALLOW_THE_SUN', null);

INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-B', 1, 'firebird', 'twins', 'ricochet', 1);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-F', 1, 'firebird', 'freeze', 'twins', 2);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-D', 1, 'firebird', 'freeze', 'thunder', 3);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-C', 1, 'freeze', 'shotgun', 'ricochet', 4);

INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-A', 2, 'firebird', 'shotgun', 'twins', 1);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-D', 2, 'shotgun', 'twins', 'ricochet', 2);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Акула T-G', 2, 'ricochet', 'rocket_launcher', 'thunder', 3);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Кодиак T-K', 2, 'freeze', 'rocket_launcher', 'artillery', 4);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Лев T-F', 2, 'rocket_launcher', 'twins', 'ricochet', 5);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Урса T-J', 2, 'twins', 'rocket_launcher', 'artillery', 6);

INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-L', 3, 'freeze', 'shotgun', 'rocket_launcher', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-J', 3, 'firebird', 'isis', 'rocket_launcher', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-H', 3, 'freeze', 'ricochet', 'machine_gun', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Барсук T-A', 3, 'firebird', 'freeze', 'shotgun', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Акула T-D', 3, 'twins', 'machine_gun', 'thunder', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Урса T-H', 3, 'isis', 'ricochet', 'artillery', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-A', 3, 'freeze', 'twins', 'smoky', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Акула T-A', 3, 'ricochet', 'machine_gun', 'thunder', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Гризли T-E', 3, 'freeze', 'ricochet', 'smoky', NULL);
INSERT INTO module (name, "rank", res1, res2, res3, idx) VALUES('Кодиак T-L', 3, 'firebird', 'machine_gun', 'artillery', NULL);

INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Огнемёт', 'firebird', 1, 1);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Фриз', 'freeze', 1, 2);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Твинс', 'twins', 1, 3);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Рикошет', 'ricochet', 1, 4);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Молот', 'shotgun', 1, 5);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Гром', 'thunder', 1, 6);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Страйкер', 'rocket_launcher', 1, 7);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Магнум', 'artillery', 1, 8);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Изида', 'isis', 2, 1);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Смоки', 'smoky', 2, 2);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Вулкан', 'machine_gun', 2, 3);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Рельса', 'railgun', 3, 1);
INSERT INTO turret (name, eng_name, "rank", IDX) VALUES('Шафт', 'shaft', 4, 2);

INSERT INTO hull (name, "rank", idx) VALUES('Титан', 1, 1);
INSERT INTO hull (name, "rank", idx) VALUES('Викинг', 1, 2);
INSERT INTO hull (name, "rank", idx) VALUES('Викинг XT', 1, 3);
INSERT INTO hull (name, "rank", idx) VALUES('Хантер', 1, 4);
INSERT INTO hull (name, "rank", idx) VALUES('Мамонт', 2, 1);
INSERT INTO hull (name, "rank", idx) VALUES('Мамонт XT', 2, 2);

-- Down

DELETE FROM PLAYER;
DELETE FROM MODULE;