const mongoose = require("mongoose")
const {Subject} = require("../database")
const hostUrl = "mongodb://127.0.0.1:27017/SCIMUS"

mongoose.connect(hostUrl)
        .then(() => {
            console.log("mongodb connected")})
        .catch(err => console.error(err))

async function del() {
  await Subject.deleteMany({})
}

del()

Subject.insertMany([ 
  // A‑Level subjects (stage 1)
  { subject_id: 1, study_stage: 1, name: "Maths", exam_board: "OCR MEI", colour: "red", papers: 3,
    formulas: "https://www.ocr.org.uk/Images/643243-formulae-booklet.pdf",
    spec: "https://www.ocr.org.uk/Images/308740-specification-accredited-a-level-gce-mathematics-b-mei-h640.pdf"
  },
  { subject_id: 2, study_stage: 1, name: "Further Maths", exam_board: "OCR MEI", colour: "purple", papers: 3,
    formulas: "https://www.ocr.org.uk/Images/643243-formulae-booklet.pdf",
    spec: "https://www.ocr.org.uk/images/308768-specification-accredited-a-level-gce-further-mathematics-b-mei-h645.pdf"
  },
  { subject_id: 3, study_stage: 1, name: "Biology", exam_board: "EDEXCEL A", colour: "green", papers: 2,
    formulas: "", 
    spec: "https://qualifications.pearson.com/content/dam/pdf/A%20Level/biology-a/2015/specification-and-sample-assessment-materials/9781446930885-gce2015-a-bioa-spec.pdf"
  },
  { subject_id: 4, study_stage: 1, name: "Chemistry", exam_board: "OCR A", colour: "orange", papers: 2,
    formulas: "https://www.ocr.org.uk/Images/363792-unit-h032-and-h432-data-sheet.pdf",
    spec: "https://www.ocr.org.uk/images/171720-specification-accredited-a-level-gce-chemistry-a-h432.pdf"
  },
  { subject_id: 5, study_stage: 1, name: "Physics", exam_board: "OCR A", colour: "blue", papers: 3,
    formulas: "https://www.ocr.org.uk/Images/363796-units-h156-and-h556-data-formulae-and-relationships-booklet.pdf",
    spec: "https://www.ocr.org.uk/images/171726-specification-accredited-a-level-gce-physics-a-h556.pdf"
  },
  { subject_id: 6, study_stage: 1, name: "Computer Science", exam_board: "OCR", colour: "yellow", papers: 2,
    formulas: "",
    spec: "https://www.ocr.org.uk/images/170844-specification-accredited-a-level-gce-computer-science-h446.pdf"
  },

  // GCSE subjects (stage 0)
  { subject_id: 7, study_stage: 0, name: "Maths", exam_board: "EDEXCEL", colour: "red", papers: 3,
    formulas: "https://qualifications.pearson.com/content/dam/pdf/GCSE/mathematics/2015/teaching-and-learning-materials/gcse-mathematics-1ma1-exam-aid-1h2h3h-june2025.pdf",
    spec: "https://qualifications.pearson.com/content/dam/pdf/GCSE/mathematics/2015/specification-and-sample-assesment/gcse-maths-2015-specification.pdf"
  },
  { subject_id: 8, study_stage: 0, name: "Biology", exam_board: "EDEXCEL", colour: "green", papers: 2,
    formulas: "",
    spec: "https://qualifications.pearson.com/content/dam/pdf/GCSE/Science/2016/Specification/gcse-biology-spec.pdf"
  },
  { subject_id: 9, study_stage: 0, name: "Chemistry", exam_board: "EDEXCEL", colour: "orange", papers: 2,
    formulas: "",
    spec: "https://qualifications.pearson.com/content/dam/pdf/GCSE/Science/2016/Specification/gcse-chemistry-spec.pdf"
  },
  { subject_id: 10, study_stage: 0, name: "Physics", exam_board: "AQA", colour: "blue", papers: 2,
    formulas: "https://cdn.sanity.io/files/p28bar15/green/9ed67743e67af60cd83b2b65a90d01a21223f52c.pdf",
    spec: "https://cdn.sanity.io/files/p28bar15/green/e96b2cef624c0970b0f90d9678a438580aed0f65.pdf"
  },

  // University / Admissions tests (stage 2)
  { subject_id: 11, study_stage: 2, name: "TMUA", exam_board: "UAT‑UK", colour: "orange", papers: 2,
    formulas: "",
    spec: "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/03165619/TMUA_Content_Specification.pdf"
  },
  { subject_id: 13, study_stage: 2, name: "ESAT", exam_board: "UAT‑UK", colour: "cyan", papers: 5,
    formulas: "",
    spec: "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/16150826/ESAT_Content_Specification_May2024.pdf" 
  },
  { subject_id: 14, study_stage: 2, name: "PAT", exam_board: "OXFORD", colour: "magenta", papers: 1,
    formulas: "",
    spec: "https://www.physics.ox.ac.uk/study/undergraduates/how-apply/engineering-and-science-admissions-test-esat/pat-syllabus"
  }
]);
