import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  // Pipeline Step State: 0 = Idle, 1 = Uploaded, 2 = Chunked, 3 = Embedded, 4 = Vector Stored, 5 = Complete
  currentStep: number = 0;
  failedStep: number | null = null; // Set step index if processing fails (e.g., 2)
  isReady: boolean = false;
  userInput: string = '';

  messages: Message[] = [
    {
      sender: 'bot',
      text: 'Hello! Upload a document using the stepper above to start querying your knowledge base.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  // Simulates uploading and the processing pipeline
  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const fileName = input.files[0].name;
    this.currentStep = 1;
    this.failedStep = null;
    this.isReady = false;

    // Simulate RAG steps asynchronously
    setTimeout(() => this.currentStep = 2, 1000); // Chunking
    setTimeout(() => this.currentStep = 3, 2200); // Embedding
    setTimeout(() => this.currentStep = 4, 3400); // Vector DB Storage
    setTimeout(() => {
      this.currentStep = 5;
      this.isReady = true;

      // Bot confirmation message
      this.messages.push({
        sender: 'bot',
        text: `Successfully ingested and indexed "${fileName}". You can now ask questions!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.scrollToBottom();
    }, 4500);
  }

  sendMessage(): void {
    if (!this.userInput.trim() || !this.isReady) return;

    const userText = this.userInput;
    this.messages.push({
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.userInput = '';
    this.scrollToBottom();

    // Simulated Bot Response
    setTimeout(() => {
      this.messages.push({
        sender: 'bot',
        text: `Based on your context context: Searching document snippets related to "${userText}"...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.scrollToBottom();
    }, 1000);
  }

  // Stepper Visual Helper Methods
  getStepClass(stepNumber: number): string {
    if (this.failedStep === stepNumber) return 'bg-danger text-white';
    if (this.currentStep >= stepNumber) return 'bg-success text-white shadow-sm';
    if (this.currentStep === stepNumber - 1) return 'bg-primary text-white spinner-grow-custom';
    return 'bg-light text-muted border';
  }

  getStepIcon(stepNumber: number, defaultIcon: string): string {
    if (this.failedStep === stepNumber) return 'bi-x-lg';
    if (this.currentStep >= stepNumber) return 'bi-check-lg';
    return defaultIcon;
  }

  resetPipeline(): void {
    this.currentStep = 0;
    this.failedStep = null;
    this.isReady = false;
    this.messages = [
      {
        sender: 'bot',
        text: 'Session reset. Please upload a document to proceed.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
