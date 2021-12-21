
CREATE TABLE classes (
	class_id VARCHAR(20) NOT NULL ,
	class_name VARCHAR(50) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE classes
	ADD CONSTRAINT PK_classes 
	PRIMARY KEY (
		class_id 	);


CREATE TABLE class_files (
	class_file_id int(11) NOT NULL ,
	file_id VARCHAR(50) NULL ,
	class_id VARCHAR(20) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE class_files
	ADD CONSTRAINT PK_class_files 
	PRIMARY KEY (
		class_file_id 
	);


CREATE TABLE class_students (
	class_student_id int(11) NOT NULL ,
	user_id VARCHAR(255) NULL ,
	class_id VARCHAR(20) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE class_students
	ADD CONSTRAINT PK_class_students 
	PRIMARY KEY (
		class_student_id 
	);


CREATE TABLE users (
	user_id VARCHAR(255) NOT NULL ,
	user_name VARCHAR(50) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE users
	ADD CONSTRAINT PK_users 
	PRIMARY KEY (
		user_id 
	);


CREATE TABLE class_teachers (
	class_teacher_id int(11) NOT NULL ,
	user_id VARCHAR(255) NULL ,
	class_id VARCHAR(20) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE class_teachers
	ADD CONSTRAINT PK_class_teachers 
	PRIMARY KEY (
		class_teacher_id 
	);


CREATE TABLE files (
	file_owner VARCHAR(255) NULL ,
	file_id VARCHAR(50) NOT NULL ,
	file_name VARCHAR(20) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE files
	ADD CONSTRAINT PK_files 
	PRIMARY KEY (
		file_id 
	);


CREATE TABLE messages (
	message_id INT NOT NULL ,
	send_user_id VARCHAR(255) NULL ,
	receive_user_id VARCHAR(255) NULL ,
	reply_message_id INT NULL ,
	content_id INT NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE messages
	ADD CONSTRAINT PK_messages 
	PRIMARY KEY (
		message_id 
	);


CREATE TABLE message_contents (
	content_id INT NOT NULL ,
	write_at DATETIME NULL ,
	content text NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE message_contents
	ADD CONSTRAINT PK_message_contents 
	PRIMARY KEY (
		content_id 
	);


CREATE TABLE users_files (
	user_file_id int(11) NOT NULL ,
	parent_folder_id VARCHAR(50) NULL ,
	file_id VARCHAR(50) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE users_files
	ADD CONSTRAINT PK_users_files 
	PRIMARY KEY (
		user_file_id 	);


CREATE TABLE folders (
	folder_id VARCHAR(50) NOT NULL ,
	parent_folder_id VARCHAR(50) NULL ,
	folder_name VARCHAR(20) NULL ,
	status TINYINT NULL ,
	reserved1 VARCHAR(300) NULL ,
	reserved2 VARCHAR(300) NULL ,
	reserved3 VARCHAR(300) NULL 
);


ALTER TABLE folders
	ADD CONSTRAINT PK_folders 
	PRIMARY KEY (
		folder_id 
	);


ALTER TABLE class_files
	ADD CONSTRAINT FK_classes_TO_class_files 
	FOREIGN KEY (
		class_id 	)
	REFERENCES classes ( 
		class_id 	);


ALTER TABLE class_files
	ADD CONSTRAINT FK_files_TO_class_files 
	FOREIGN KEY (
		file_id 
	)
	REFERENCES files ( 
		file_id 
	);


ALTER TABLE class_students
	ADD CONSTRAINT FK_classes_TO_class_students 
	FOREIGN KEY (
		class_id 	)
	REFERENCES classes ( 
		class_id 	);


ALTER TABLE class_students
	ADD CONSTRAINT FK_users_TO_class_students 
	FOREIGN KEY (
		user_id 
	)
	REFERENCES users ( 
		user_id 
	);


ALTER TABLE class_teachers
	ADD CONSTRAINT FK_users_TO_class_teachers 
	FOREIGN KEY (
		user_id 
	)
	REFERENCES users ( 
		user_id 
	);


ALTER TABLE class_teachers
	ADD CONSTRAINT FK_classes_TO_class_teachers 
	FOREIGN KEY (
		class_id 	)
	REFERENCES classes ( 
		class_id 	);


ALTER TABLE files
	ADD CONSTRAINT FK_users_TO_files 
	FOREIGN KEY (
		file_owner 
	)
	REFERENCES users ( 
		user_id 
	);


ALTER TABLE messages
	ADD CONSTRAINT FK_users_TO_messages 
	FOREIGN KEY (
		send_user_id 
	)
	REFERENCES users ( 
		user_id 
	);


ALTER TABLE messages
	ADD CONSTRAINT FK_users_TO_messages2 
	FOREIGN KEY (
		receive_user_id 	)
	REFERENCES users ( 
		user_id 
	);


ALTER TABLE messages
	ADD CONSTRAINT FK_message_contents_TO_messages 
	FOREIGN KEY (
		content_id 
	)
	REFERENCES message_contents ( 
		content_id 
	);


ALTER TABLE messages
	ADD CONSTRAINT FK_messages_TO_messages 
	FOREIGN KEY (
		reply_message_id 
	)
	REFERENCES messages ( 
		message_id 
	);


ALTER TABLE users_files
	ADD CONSTRAINT FK_files_TO_users_files 
	FOREIGN KEY (
		file_id 
	)
	REFERENCES files ( 
		file_id 
	);


ALTER TABLE users_files
	ADD CONSTRAINT FK_folders_TO_users_files 
	FOREIGN KEY (
		parent_folder_id 
	)
	REFERENCES folders ( 
		folder_id 
	);


ALTER TABLE folders
	ADD CONSTRAINT FK_folders_TO_folders 
	FOREIGN KEY (
		parent_folder_id 
	)
	REFERENCES folders ( 
		folder_id 
	);