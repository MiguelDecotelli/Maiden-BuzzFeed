import { Component } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json"

interface Result {
  imagePath: string;
}

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent {
  myTitle: string = "";

  myQuestions: any;
  selectedQuestion: any;

  playerAnswer: string[] = [];
  selectedAnswer: Result | null = null;

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false
      this.myTitle = quizz_questions.title;

      this.myQuestions = quizz_questions.questions;
      this.selectedQuestion = this.myQuestions[this.questionIndex];

      this.questionIndex = 0;
      this.questionMaxIndex = this.myQuestions.length
    }
  }

  playerChoice(value: string) {
    this.playerAnswer.push(value)
    this.nextQuestion()
  }

  async nextQuestion() {
    this.questionIndex += 1

    if (this.questionMaxIndex > this.questionIndex) {
      this.selectedQuestion = this.myQuestions[this.questionIndex]
    } else {
      const finalAnswer: string = await this.checkResult(this.playerAnswer)
      this.finished = true
      this.selectedAnswer = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results]
    }

  }

  async checkResult(playerAnswer: string[]) {

    const result = playerAnswer.reduce((previous, current, i, array) => {
      if (array.filter(item => item === previous).length > array.filter(item => item === current).length) {
        return previous
      } else {
        return current
      }
    })
    return result
  }
}
