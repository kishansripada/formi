export type dancer = {
    name: string;
    id: string;
 };


 export type dancerPosition = {
    id: string;
    position: { x: number ; y: number  };
    exitStrategy?: "left" | "right" | null
    enterStrategy?: "left" | "right" | null
 };
 
 
export type formation = {
    durationSeconds: number;
    positions: dancerPosition[];
    transition: {
       durationSeconds: number;
    };
    name: string | null
 };


 let example = [
    {
        "durationSeconds": 3.004003172903587,
        "positions": [
            {
                "id": "d3711249-85f2-4664-bfe2-e4886a3bc399",
                "position": {
                    "x": 2,
                    "y": 1
                }
            },
            {
                "id": "cf5b5d33-32a6-49b6-8ccd-8dc4cbb4af76",
                "position": {
                    "x": -2,
                    "y": 1
                }
            }
        ],
        "transition": {
            "durationSeconds": 5
        }
    },
    {
        "durationSeconds": 6.587728815750458,
        "positions": [
            {
                "id": "cf5b5d33-32a6-49b6-8ccd-8dc4cbb4af76",
                "position": {
                    "x": 2,
                    "y": -1
                }
            },
            {
                "id": "d3711249-85f2-4664-bfe2-e4886a3bc399",
                "position": {
                    "x": -2,
                    "y": -1
                }
            }
        ],
        "transition": {
            "durationSeconds": 5
        }
    },
    {
        "durationSeconds": 9.616241022288555,
        "positions": [
            {
                "id": "cf5b5d33-32a6-49b6-8ccd-8dc4cbb4af76",
                "position": {
                    "x": -1,
                    "y": 1
                }
            }
        ],
        "transition": {
            "durationSeconds": 5
        }
    }
]

