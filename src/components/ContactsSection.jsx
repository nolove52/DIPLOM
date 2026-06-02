import React, { useState } from "react";
import { sendEmail } from "../utils/emailApi";

const CONTACTS_STORAGE_KEY = "vskturnContacts";

const contactInfo = {
  phone: "+79143354071",
  phonePretty: "+7 914 335-40-71",
  email: "nolove.vanlav@mail.ru",
  address: "г. Владивосток, ул. Спиридонова, 40",
  mapQuery: "Владивосток, улица Спиридонова, 40",
};

export default function ContactsSection({
  onAddContact,
  onContactSubmit,
  onSubmitContact,
  onCreateContact,
  addContact,
  setContacts,
  showToast,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveContactLocally = (contact) => {
    try {
      const savedContacts = JSON.parse(
        localStorage.getItem(CONTACTS_STORAGE_KEY) || "[]"
      );
      localStorage.setItem(
        CONTACTS_STORAGE_KEY,
        JSON.stringify([contact, ...savedContacts])
      );
    } catch (error) {
      console.error("Не удалось сохранить обращение", error);
    }
  };

  const notifyApp = (contact) => {
    const callbacks = [
      onAddContact,
      onContactSubmit,
      onSubmitContact,
      onCreateContact,
      addContact,
    ];

    callbacks.forEach((callback) => {
      if (typeof callback === "function") {
        callback(contact);
      }
    });

    if (typeof setContacts === "function") {
      setContacts((prev) => [contact, ...(Array.isArray(prev) ? prev : [])]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", text: "" });

    const contact = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      status: "Новое",
      createdAt: new Date().toLocaleString("ru-RU"),
    };

    if (!contact.name || !contact.email || !contact.message) {
      setStatus({ type: "error", text: "Заполните имя, email и сообщение." });
      return;
    }

    setIsSending(true);

    try {
      await sendEmail({
        to: contact.email,
        subject: "VSKturn 2026: мы получили ваше обращение",
        message: `Здравствуйте, ${contact.name}!\n\nМы получили ваше сообщение и свяжемся с вами в ближайшее время.\n\nВаше сообщение:\n${contact.message}`,
        adminSubject: `Новое обращение VSKturn 2026: ${contact.name}`,
        adminMessage: `Поступило новое обращение с сайта VSKturn 2026.`,
        details: [
          { label: "Имя", value: contact.name },
          { label: "Email", value: contact.email },
          { label: "Телефон", value: contact.phone || "Не указан" },
          { label: "Сообщение", value: contact.message },
          { label: "Дата", value: contact.createdAt },
        ],
      });

      notifyApp({ ...contact, emailStatus: "Письмо отправлено" });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setStatus({
        type: "success",
        text: "Настоящее письмо отправлено на указанную почту. Заявка сохранена.",
      });

      if (typeof showToast === "function") {
        showToast("Письмо отправлено на указанную почту");
      }
    } catch (error) {
      const failedContact = { ...contact, emailStatus: "Ошибка отправки письма" };
      saveContactLocally(failedContact);
      notifyApp(failedContact);
      setStatus({
        type: "error",
        text:
          error.message ||
          "Обращение сохранено, но письмо не отправилось. Запустите server и проверьте SMTP-настройки.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    contactInfo.mapQuery
  )}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contactInfo.mapQuery
  )}`;

  return (
    <section
      id="contacts"
      className="relative overflow-hidden bg-[#070812] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
            Контакты 2026
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Свяжитесь с командой VSKturn
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
            Укажите свою почту в форме — после отправки на неё придёт настоящее
            письмо-подтверждение, если backend и SMTP настроены.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
              <h3 className="mb-6 text-2xl font-bold">Контакты</h3>

              <div className="space-y-4">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-xl">
                    ☎
                  </span>
                  <span>
                    <span className="block text-sm text-slate-400">Телефон</span>
                    <span className="font-semibold text-white group-hover:text-cyan-300">
                      {contactInfo.phonePretty}
                    </span>
                  </span>
                </a>

                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-xl">
                    ✉
                  </span>
                  <span>
                    <span className="block text-sm text-slate-400">Email</span>
                    <span className="break-all font-semibold text-white group-hover:text-cyan-300">
                      {contactInfo.email}
                    </span>
                  </span>
                </a>

                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-xl">
                    ⌖
                  </span>
                  <span>
                    <span className="block text-sm text-slate-400">Адрес</span>
                    <span className="font-semibold text-white group-hover:text-cyan-300">
                      {contactInfo.address}
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-cyan-950/20">
              <div className="border-b border-white/10 p-5">
                <h3 className="text-xl font-bold">Мы на карте</h3>
                <p className="mt-1 text-sm text-slate-400">
                  г. Владивосток, ул. Спиридонова, 40
                </p>
              </div>
              <div className="h-[360px] w-full bg-slate-900">
                <iframe
                  title="Карта: Владивосток, улица Спиридонова, 40"
                  src={mapSrc}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:p-8"
          >
            <h3 className="text-2xl font-bold">Оставить обращение</h3>
            <p className="mt-3 text-slate-300">
              Впишите email — именно на него будет отправлено письмо-подтверждение.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Ваше имя *
                </span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  placeholder="Введите имя"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Email для письма *
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  placeholder="example@mail.ru"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-300">
                Телефон
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                placeholder="+7 999 000-00-00"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-300">
                Сообщение *
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="7"
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                placeholder="Напишите вопрос по турниру, заявке или команде"
              />
            </label>

            <button
              type="submit"
              disabled={isSending}
              className="mt-6 w-full rounded-2xl bg-cyan-400 px-6 py-4 text-base font-black text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99] disabled:cursor-wait disabled:bg-slate-500"
            >
              {isSending ? "Отправляем письмо..." : "Отправить настоящее письмо"}
            </button>

            {status.text && (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  status.type === "success"
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-red-400/40 bg-red-500/10 text-red-200"
                }`}
              >
                {status.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
