export const MOCK_QUIZ_DATA = [
{
"id": 
"q1",
            "question": "Apa saja tujuan utama dari infrastruktur data yang dijelaskan dalam konteks materi?",
            "pre_hint": "Pikirkan tentang fungsi utama infrastruktur data yang disebutkan dalam teks.",
            "feedback": "Infrastruktur data bertujuan untuk menyediakan pengelolaan data yang baik, memproses data, dan menganalisis data.",
            "options": [
                {
                    "id": "a",
                    "text": "Menyediakan pengelolaan data yang baik.",
                    "is_correct": true
                },
                {
                    "id": "b",
                    "text": "Memproses data.",
                    "is_correct": true
                },
                {
                    "id": "c",
                    "text": "Mengurangi biaya operasional.",
                    "is_correct": false
                },
                {
                    "id": "d",
                    "text": "Menganalisis data.",
                    "is_correct": true
                }
            ]
        },
        {
            "id": "q2",
            "question": "Manfaat apa saja yang didapatkan dengan menggunakan infrastruktur data yang baik?",
            "pre_hint": "Perhatikan aspek-aspek seperti keamanan, integrasi, dan kemudahan pengelolaan data.",
            "feedback": "Infrastruktur data memberikan manfaat dalam hal keamanan, integrasi, dan kemudahan pengelolaan data.",
            "options": [
                {
                    "id": "a",
                    "text": "Data menjadi lebih aman.",
                    "is_correct": true
                },
                {
                    "id": "b",
                    "text": "Data mudah diintegrasikan dari berbagai sumber.",
                    "is_correct": true
                },
                {
                    "id": "c",
                    "text": "Mengurangi kebutuhan sumber daya manusia.",
                    "is_correct": false
                },
                {
                    "id": "d",
                    "text": "Data mudah dikelola.",
                    "is_correct": true
                }
            ]
        },
        {
            "id": "q3",
            "question": "Fitur-fitur apa saja yang disediakan oleh infrastruktur data untuk mendukung pengelolaan data?",
            "pre_hint": "Pikirkan tentang aspek-aspek yang dibahas dalam konteks materi.",
            "feedback": "Infrastruktur data menyediakan fitur untuk manajemen data, pemrosesan data, integrasi data, dan keamanan data.",
            "options": [
                {
                    "id": "a",
                    "text": "Manajemen data yang terpusat.",
                    "is_correct": true
                },
                {
                    "id": "b",
                    "text": "Daya komputasi untuk pemrosesan data.",
                    "is_correct": true
                },
                {
                    "id": "c",
                    "text": "Fitur keamanan untuk melindungi data.",
                    "is_correct": true
                },
                {
                    "id": "d",
                    "text": "Meningkatkan kecepatan internet.",
                    "is_correct": false
                }
        ],
    },
];

// data awal state kuis yang akan disimpan di Local Storagez
export const INITIAL_QUIZ_STATE = {
    questions: MOCK_QUIZ_DATA,
    answers: {}, 
    checkedStatus: {}, 
    isCompleted: false,
    score: 0,
};