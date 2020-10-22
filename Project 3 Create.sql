-- tables
-- Table: Advisors
CREATE TABLE advisors (
    advisor_ID int NOT NULL,
    is_admin bool NOT NULL,
    advisor_last_name varchar(20) NOT NULL,
    advisor_first_name varchar(20) NOT NULL,
    advisor_initial varchar(1) NULL,
    CONSTRAINT advisors_pk PRIMARY KEY (advisor_ID)
);

-- Table: Course
CREATE TABLE course (
    course_ID int NOT NULL,
    department char(4) NOT NULL,
    number char(9) NOT NULL,
    name varchar(100) NOT NULL,
    description varchar(2000) NULL,
    hours int NOT NULL,
    level char(1) NOT NULL,
    CONSTRAINT course_pk PRIMARY KEY (course_ID)
);

-- Table: CoursePlan
CREATE TABLE courseplan (
    plan_ID int NOT NULL,
    course_ID int NOT NULL,
    course_letter_grade varchar(3) NOT NULL,
    course_term varchar(3) NOT NULL
);

-- Table: degreeplans
CREATE TABLE degreeplans (
    plan_ID int NOT NULL,
    plan_name varchar(30) NOT NULL,
    CONSTRAINT degreeplans_pk PRIMARY KEY (plan_ID)
);

-- Table: Students
CREATE TABLE students (
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
    CONSTRAINT students_pk PRIMARY KEY (student_ID)
);

-- foreign keys
-- Reference: CoursePlan_Courses (table: CoursePlan)
ALTER TABLE courseplan ADD CONSTRAINT courseplan_courses FOREIGN KEY courseplan_courses (course_ID)
    REFERENCES course (course_ID);

-- Reference: DegreePlans_CoursePlan (table: CoursePlan)
ALTER TABLE courseplan ADD CONSTRAINT degreeplans_courseplan FOREIGN KEY degreeplans_courseplan (plan_ID)
    REFERENCES degreeplans (plan_ID);

-- Reference: DegreePlans_Students (table: Students)
ALTER TABLE students ADD CONSTRAINT degreeplans_students FOREIGN KEY degreeplans_students (plan_ID)
    REFERENCES degreeplans (plan_ID);

-- Reference: Students_Advisors (table: Students)
ALTER TABLE students ADD CONSTRAINT students_advisors FOREIGN KEY students_advisors (advisor_ID)
    REFERENCES advisors (advisor_ID);

-- End of file.

