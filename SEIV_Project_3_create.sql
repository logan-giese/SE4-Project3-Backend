-- tables
-- Table: Advisors
CREATE TABLE `advisors` (
    `advisor_id` int NOT NULL,
    `is_admin` bool DEFAULT NULL,
    `advisor_last_name` varchar(20) DEFAULT NULL,
    `advisor_first_name` varchar(20) DEFAULT NULL,
    `advisor_initial` varchar(1) DEFAULT NULL,
    CONSTRAINT advisors_pk PRIMARY KEY (advisor_id)
);

-- Table: Course
CREATE TABLE `course` (
    `course_id` int NOT NULL AUTO_INCREMENT,
    `department` char(4) DEFAULT NULL,
    `number` char(9) DEFAULT NULL,
    `name` varchar(100) DEFAULT NULL,
    `description` varchar(2000) DEFAULT NULL,
    `hours` int DEFAULT NULL,
    `level` char(1) DEFAULT NULL,
    CONSTRAINT course_pk PRIMARY KEY (course_id)
);

-- Table: CoursePlan
CREATE TABLE `courseplan` (
    `plan_id` int NOT NULL,
    `course_id` int NOT NULL,
    `course_letter_grade` varchar(3) DEFAULT NULL,
    `course_term` varchar(3)DEFAULT NULL
);

-- Table: degreeplans
CREATE TABLE `degreeplans` (
    `plan_ID` int NOT NULL,
    `plan_name` varchar(30) DEFAULT NULL,
    CONSTRAINT degreeplans_pk PRIMARY KEY (plan_id)
);

-- Table: Students
CREATE TABLE `students` (
    `student_id` int NOT NULL,
    `student_last_name` varchar(20) DEFAULT NULL,
    `student_first_name` varchar(20) DEFAULT NULL,
    `student_initial` varchar(1) DEFAULT NULL,
    `student_major` varchar(50) DEFAULT NULL,
    `student_gpa` real(2,1) DEFAULT NULL,
    `student_hours_remaining` int DEFAULT NULL,
    `student_last_updated` timestamp NOT NULL,
    `student_expected_grad_date` date DEFAULT NULL,
    `student_degree_progress` int DEFAULT NULL,
    `advisor_id` int NOT NULL,
    `plan_id` int NOT NULL,
    CONSTRAINT students_pk PRIMARY KEY (student_id)
);

-- foreign keys
-- Reference: CoursePlan_Courses (table: CoursePlan)
ALTER TABLE courseplan ADD CONSTRAINT courseplan_courses FOREIGN KEY courseplan_courses (course_id)
    REFERENCES course (course_id);

-- Reference: DegreePlans_CoursePlan (table: CoursePlan)
ALTER TABLE courseplan ADD CONSTRAINT degreeplans_courseplan FOREIGN KEY degreeplans_courseplan (plan_id)
    REFERENCES degreeplans (plan_id);

-- Reference: DegreePlans_Students (table: Students)
ALTER TABLE students ADD CONSTRAINT degreeplans_students FOREIGN KEY degreeplans_students (plan_id)
    REFERENCES degreeplans (plan_id);

-- Reference: Students_Advisors (table: Students)
ALTER TABLE students ADD CONSTRAINT students_advisors FOREIGN KEY students_advisors (advisor_id)
    REFERENCES advisors (advisor_id);

-- End of file.
