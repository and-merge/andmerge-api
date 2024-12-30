create table users
(
	id serial primary key,
	email varchar(255) not null unique,
	name varchar(255) not null,
    figma_id varchar(19) not null unique,
    image_url varchar(255),
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    is_active boolean default true
);

-- teams

create table projects

(
	id serial primary key,
	name varchar(255) not null,
	figma_file_key varchar(22) not null,
	figma_link varchar(255) not null,
	created_at timestamp default current_timestamp,
    updated_at timestamp,
	created_by_user_id int,
	updated_by_user_id int,
	FOREIGN KEY (created_by_user_id) REFERENCES users(id),
	FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
);

create table project_pages
(
	id serial primary key,
	project_id int not null,
	name varchar(255) not null,
	figma_node_id varchar(255),
	created_at timestamp default current_timestamp,
    updated_at timestamp,
	created_by_user_id int,
	updated_by_user_id int,
	FOREIGN KEY (project_id) REFERENCES projects(id),
	FOREIGN KEY (created_by_user_id) REFERENCES users(id),
	FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
);

-- project_page_documentations

create table project_page_screens
(
	id serial primary key,
	project_page_id int not null,
	name varchar(255) not null,
	figma_node_id varchar(255),
    image_url varchar(255),
	created_at timestamp default current_timestamp,
    updated_at timestamp,
	created_by_user_id int,
	updated_by_user_id int,
	FOREIGN KEY (project_page_id) REFERENCES project_pages(id),
	FOREIGN KEY (created_by_user_id) REFERENCES users(id),
	FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
);

-- project_page_screen_variations
	-- project_page_screen_breakpoints

-- project_page_screen_versions
	-- project_page_screen_documentations
