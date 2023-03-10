import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  // TEST VARS
  projectList = ['Projet 1', 'Projet 2 ', 'Projet 3 '];
  phaseList = ['phase 1', 'phase 2', 'phase 3'];
  stepList = ['step 1', 'step 2 ', 'step 3 '];
  userList = ['User 1 ', 'User 2', 'User 3 '];
  taskList = ['task 1', 'task 2 ', 'task 3 '];
  // ---------
  taskForm = new FormGroup({
    project: new FormControl(null, Validators.required),
    phase: new FormControl(null, Validators.required),
    step: new FormControl(null, Validators.required),
    taskName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    assignedUser: new FormControl(false, Validators.required),
    parentTask: new FormControl(false, Validators.required),
  });

  onSubmit() {}
}
