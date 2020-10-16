-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2020-10-15 02:59:07.451

-- tables
-- Table: Advisors
CREATE TABLE Advisors (
    advisor_ID int NOT NULL,
    is_admin bool NOT NULL,
    advisor_last_name varchar(20) NOT NULL,
    advisor_first_name varchar(20) NOT NULL,
    advisor_initial varchar(1) NULL,
    CONSTRAINT Advisors_pk PRIMARY KEY (advisor_ID)
);

-- Table: Course
CREATE TABLE Course (
    course_ID int NOT NULL,
    department char(4) NOT NULL,
    number char(9) NOT NULL,
    name varchar(100) NOT NULL,
    description varchar(2000) NULL,
    hours int NOT NULL,
    level char(1) NOT NULL,
    term_start date NOT NULL,
    term_end date NOT NULL,
    CONSTRAINT Course_pk PRIMARY KEY (course_ID)
);

-- Table: CoursePlan
CREATE TABLE CoursePlan (
    plan_ID int NOT NULL,
    course_ID int NOT NULL,
    course_letter_grade varchar(3) NOT NULL
);

-- Table: DegreePlans
CREATE TABLE DegreePlans (
    plan_ID int NOT NULL,
    plan_name varchar(30) NOT NULL,
    CONSTRAINT DegreePlans_pk PRIMARY KEY (plan_ID)
);

-- Table: Students
CREATE TABLE Students (
    student_ID int NOT NULL,
    student_last_name varchar(20) NOT NULL,
    student_first_name varchar(20) NOT NULL,
    student_initial varchar(1) NULL,
    student_major varchar(30) NOT NULL,
    student_GPA real(2,1) NOT NULL,
    student_hours_remaining int NOT NULL,
    student_last_updated timestamp NOT NULL,
    student_expected_grad_date date NOT NULL,
    student_degree_progress int NOT NULL,
    advisor_ID int NOT NULL,
    plan_ID int NOT NULL,
    CONSTRAINT Students_pk PRIMARY KEY (student_ID)
);

-- foreign keys
-- Reference: CoursePlan_Courses (table: CoursePlan)
ALTER TABLE CoursePlan ADD CONSTRAINT CoursePlan_Courses FOREIGN KEY CoursePlan_Courses (course_ID)
    REFERENCES Course (course_ID);

-- Reference: DegreePlans_CoursePlan (table: CoursePlan)
ALTER TABLE CoursePlan ADD CONSTRAINT DegreePlans_CoursePlan FOREIGN KEY DegreePlans_CoursePlan (plan_ID)
    REFERENCES DegreePlans (plan_ID);

-- Reference: DegreePlans_Students (table: Students)
ALTER TABLE Students ADD CONSTRAINT DegreePlans_Students FOREIGN KEY DegreePlans_Students (plan_ID)
    REFERENCES DegreePlans (plan_ID);

-- Reference: Students_Advisors (table: Students)
ALTER TABLE Students ADD CONSTRAINT Students_Advisors FOREIGN KEY Students_Advisors (advisor_ID)
    REFERENCES Advisors (advisor_ID);

-- End of file.

