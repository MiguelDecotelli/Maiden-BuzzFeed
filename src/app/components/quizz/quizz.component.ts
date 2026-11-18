import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {
  myTitle: string = '';
  myQuestions: any[] = [];
  selectedQuestion: any;
  
  questionIndex: number = 0;
  questionMaxIndex: number = 0;
  
  playerAnswers: any[] = [];
  selectedAnswer: any; 
  
  started: boolean = false;
  finished: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (quizz_questions) {
      this.myTitle = quizz_questions.title;
      this.prepareQuestions();
      this.questionMaxIndex = this.myQuestions.length;
      this.selectedQuestion = this.myQuestions[0];
    }
  }

  startQuizz() {
    this.started = true;
  }

  get progressPercentage(): number {
    if (!this.questionMaxIndex) return 0;
    return ((this.questionIndex + 1) / this.questionMaxIndex) * 100;
  }

  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  prepareQuestions() {
    let allQuestions = this.shuffleArray([...quizz_questions.questions]);
    this.myQuestions = allQuestions.slice(0, 6);

    this.myQuestions.forEach(q => {
      q.options = this.shuffleArray([...q.options]);
    });
  }

  playerChoice(scores: any) {
    this.playerAnswers.push(scores);
    this.nextStep();
  }

  nextStep() {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.selectedQuestion = this.myQuestions[this.questionIndex];
    } else {
      const finalAlbumKey = this.calculateResult();
      this.finished = true;
      this.selectedAnswer = quizz_questions.results[finalAlbumKey as keyof typeof quizz_questions.results];
    }
  }

  calculateResult(): string {
    const scoreboard: { [key: string]: number } = {};

    this.playerAnswers.forEach(scoreObject => {
      for (const album in scoreObject) {
        scoreboard[album] = (scoreboard[album] || 0) + scoreObject[album];
      }
    });

    let winningAlbum = 'powerslave';
    let maxScore = -1;

    for (const album in scoreboard) {
      if (scoreboard[album] > maxScore) {
        maxScore = scoreboard[album];
        winningAlbum = album;
      }
    }

    return winningAlbum;
  }

  resetQuizz() {
    this.finished = false;
    this.started = true; // Vai direto para as novas perguntas ao reiniciar
    this.playerAnswers = [];
    this.questionIndex = 0;
    this.prepareQuestions();
    this.questionMaxIndex = this.myQuestions.length;
    this.selectedQuestion = this.myQuestions[this.questionIndex];
  }

  getShareText(): string {
    return `Descobri que a minha alma Maiden pertence ao álbum *${this.selectedAnswer.name}*! Descubra o seu no Maiden Feed! 🤘 \n\nhttps://migueldecotelli.github.io/Maiden-Feed/`;
  }

  shareWhatsApp() {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(this.getShareText())}`, '_blank');
  }

  shareX() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.getShareText())}`, '_blank');
  }
}