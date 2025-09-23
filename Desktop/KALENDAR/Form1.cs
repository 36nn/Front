
using System;
using System.Drawing;
using System.Windows.Forms;

// Класс главной формы приложения
public class Form1 : System.Windows.Forms.Form
{
    // Объявление элементов управления
    private System.Windows.Forms.MonthCalendar monthCalendar1;
    private System.Windows.Forms.TextBox textBox1;

    // Точка входа в приложение
    [STAThread]
    static void Main()
    {
        Application.Run(new Form1());
    }

    public Form1()
    {
        // Инициализация текстового поля
        this.textBox1 = new System.Windows.Forms.TextBox();
        this.textBox1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
        this.textBox1.Location = new System.Drawing.Point(48, 488);
        this.textBox1.Multiline = true;
        this.textBox1.ReadOnly = true;
        this.textBox1.Size = new System.Drawing.Size(824, 32);

        // Создание календаря
        this.monthCalendar1 = new System.Windows.Forms.MonthCalendar();
        this.monthCalendar1.Location = new System.Drawing.Point(47, 16);
        // Изменение цветов
        this.monthCalendar1.BackColor = System.Drawing.SystemColors.Info;
        this.monthCalendar1.ForeColor = System.Drawing.Color.FromArgb(((System.Byte)(192)), ((System.Byte)(0)), ((System.Byte)(192)));
        this.monthCalendar1.TitleBackColor = System.Drawing.Color.Purple;
        this.monthCalendar1.TitleForeColor = System.Drawing.Color.Yellow;
        this.monthCalendar1.TrailingForeColor = System.Drawing.Color.FromArgb(((System.Byte)(192)), ((System.Byte)(192)), ((System.Byte)(0)));

        // Добавление дат в массив ежегодных выделенных дат
        this.monthCalendar1.AnnuallyBoldedDates = new System.DateTime[] {
            new System.DateTime(2002, 4, 20, 0, 0, 0, 0),
            new System.DateTime(2002, 4, 28, 0, 0, 0, 0),
            new System.DateTime(2002, 5, 5, 0, 0, 0, 0),
            new System.DateTime(2002, 7, 4, 0, 0, 0, 0),
            new System.DateTime(2002, 12, 15, 0, 0, 0, 0),
            new System.DateTime(2002, 12, 18, 0, 0, 0, 0),
            new System.DateTime(2012, 2, 2, 0, 0, 0, 0)
        };

        // Добавление дат в массив выделенных дат
        this.monthCalendar1.BoldedDates = new System.DateTime[] {
            new System.DateTime(2002, 9, 26, 0, 0, 0, 0),
            new System.DateTime(2012, 5, 15, 0, 0, 0, 0),
            new System.DateTime(2012, 6, 25, 0, 0, 0, 0),
            new System.DateTime(2012, 6, 29, 0, 0, 0, 0)
        };

        this.monthCalendar1.MonthlyBoldedDates = new System.DateTime[] {
            new System.DateTime(2002, 1, 15, 0, 0, 0, 0),
            new System.DateTime(2002, 1, 30, 0, 0, 0, 0)
        };

        this.monthCalendar1.CalendarDimensions = new System.Drawing.Size(4, 3);
        this.monthCalendar1.FirstDayOfWeek = System.Windows.Forms.Day.Monday;
        this.monthCalendar1.MaxDate = new System.DateTime(2010, 12, 31, 0, 0, 0, 0);
        this.monthCalendar1.MinDate = new System.DateTime(1999, 1, 1, 0, 0, 0, 0);
        this.monthCalendar1.MaxSelectionCount = 21;
        this.monthCalendar1.ScrollChange = 1;
        this.monthCalendar1.ShowToday = false;
        this.monthCalendar1.ShowTodayCircle = false;
        this.monthCalendar1.ShowWeekNumbers = true;

        // Добавление обработчиков событий DateSelected и DateChanged
        this.monthCalendar1.DateSelected += new System.Windows.Forms.DateRangeEventHandler(this.monthCalendar1_DateSelected);
        this.monthCalendar1.DateChanged += new System.Windows.Forms.DateRangeEventHandler(this.monthCalendar1_DateChanged);

        // Настройка отображения формы и добавление элементов управления
        this.ClientSize = new System.Drawing.Size(920, 566);
        this.Controls.AddRange(new System.Windows.Forms.Control[] { this.textBox1, this.monthCalendar1 });
        this.Text = "Пример календаря месяцев";
    }

    // Обработчик события выбора даты
    private void monthCalendar1_DateSelected(object sender, System.Windows.Forms.DateRangeEventArgs e)
    {
        // Показать начальную и конечную даты в текстовом поле
        this.textBox1.Text = "Дата выбрана: Начало = " +
            e.Start.ToShortDateString() + " : Конец = " + e.End.ToShortDateString();
    }

}